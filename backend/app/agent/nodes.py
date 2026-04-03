import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.services.arxiv_service import fetch_papers, fetch_paper_by_url
from app.agent.state import AgentState

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.1,
)


def is_arxiv_url(text: str) -> bool:
    return "arxiv.org" in text


# ── Node 1: Plan Search Query ──────────────────────────────────────────────────
def plan_search(state: AgentState) -> AgentState:
    """
    If input is a URL: extract the paper and build a query from its title.
    If input is a topic: refine it into a good ArXiv search query.
    """
    user_input = state["user_input"]

    if is_arxiv_url(user_input):
        paper = fetch_paper_by_url(user_input)
        if not paper:
            return {**state, "error": "Could not fetch paper from URL", "current_step": "error"}

        # Use first 8 words of title as search query
        query = " ".join(paper.title.split()[:8])
        return {
            **state,
            "search_query": query,
            "current_step": "fetch_papers",
            "steps_completed": state["steps_completed"] + ["plan_search"],
        }

    # For topic input, use LLM to refine into a good ArXiv query
    messages = [
        SystemMessage(content="You are a research assistant. Given a research topic, generate an optimal ArXiv search query — concise, using technical terminology, no more than 10 words. Return ONLY the query string, nothing else."),
        HumanMessage(content=f"Topic: {user_input}"),
    ]
    response = llm.invoke(messages)
    query = response.content.strip().strip('"')

    return {
        **state,
        "search_query": query,
        "current_step": "fetch_papers",
        "steps_completed": state["steps_completed"] + ["plan_search"],
    }


# ── Node 2: Fetch Papers ───────────────────────────────────────────────────────
def fetch_papers_node(state: AgentState) -> AgentState:
    papers = fetch_papers(state["search_query"], max_results=state["max_papers"] + 5)
    raw = [p.__dict__ for p in papers]

    return {
        **state,
        "raw_papers": raw,
        "current_step": "filter_relevance",
        "steps_completed": state["steps_completed"] + ["fetch_papers"],
    }


# ── Node 3: Filter for Relevance ───────────────────────────────────────────────
def filter_relevance(state: AgentState) -> AgentState:
    """
    Use LLM to score each paper's relevance to the original user input.
    Keep only papers scoring >= 6/10.
    """
    topic = state["user_input"]
    papers = state["raw_papers"]

    # Build a batch prompt — send all abstracts at once to save API calls
    papers_text = ""
    for i, p in enumerate(papers):
        papers_text += f"\n[{i}] Title: {p['title']}\nAbstract: {p['abstract'][:400]}\n"

    messages = [
        SystemMessage(content="""You are a research relevance scorer. 
Given a topic and a list of papers, score each paper's relevance from 1-10.
Return ONLY a JSON array of objects with keys "index" and "score". 
Example: [{"index": 0, "score": 8}, {"index": 1, "score": 3}]
No explanation, no markdown, just the JSON array."""),
        HumanMessage(content=f"Topic: {topic}\n\nPapers:{papers_text}"),
    ]

    response = llm.invoke(messages)

    try:
        scores = json.loads(response.content.strip())
        high_relevance = [s["index"] for s in scores if s["score"] >= 6]
        filtered = [papers[i] for i in high_relevance if i < len(papers)]
    except (json.JSONDecodeError, KeyError):
        # If LLM fails to return valid JSON, keep all papers
        filtered = papers

    # Ensure we don't exceed max_papers
    filtered = filtered[:state["max_papers"]]

    return {
        **state,
        "filtered_papers": filtered,
        "current_step": "detect_relationships",
        "steps_completed": state["steps_completed"] + ["filter_relevance"],
    }


# ── Node 4: Detect Relationships ──────────────────────────────────────────────
def detect_relationships(state: AgentState) -> AgentState:
    """
    For each pair of papers, use LLM to determine if a meaningful relationship exists.
    To save API calls, we batch this: give LLM all titles + abstracts and ask it 
    to identify relationships in one shot.
    """
    papers = state["filtered_papers"]
    if len(papers) < 2:
        return {**state, "relationships": [], "current_step": "analyze_gaps", "steps_completed": state["steps_completed"] + ["detect_relationships"]}

    # Build a condensed representation
    papers_text = ""
    for i, p in enumerate(papers):
        papers_text += f"\n[{i}] ID:{p['arxiv_id']} | {p['title']}\nAbstract snippet: {p['abstract'][:300]}\n"

    messages = [
        SystemMessage(content="""You are a research graph builder.
Given a list of papers, identify meaningful relationships between them.
Relationships can be: "extends" (B builds on A's ideas), "contradicts" (B disputes A's claims), "replicates" (B reproduces A), "related" (similar topic/method).
Return ONLY a JSON array. Each object: {"source": index, "target": index, "relationship": "...", "confidence": 0.0-1.0}
Only include relationships you're confident about (confidence >= 0.6).
No markdown, no explanation, just the JSON array."""),
        HumanMessage(content=f"Papers:{papers_text}"),
    ]

    response = llm.invoke(messages)

    edges = []
    try:
        raw_edges = json.loads(response.content.strip())
        for e in raw_edges:
            source_idx = e["source"]
            target_idx = e["target"]
            if source_idx < len(papers) and target_idx < len(papers):
                edges.append({
                    "source_id": papers[source_idx]["arxiv_id"],
                    "target_id": papers[target_idx]["arxiv_id"],
                    "relationship": e["relationship"],
                    "confidence": float(e.get("confidence", 0.7)),
                })
    except (json.JSONDecodeError, KeyError, IndexError):
        edges = []  # Fail gracefully

    return {
        **state,
        "relationships": edges,
        "current_step": "analyze_gaps",
        "steps_completed": state["steps_completed"] + ["detect_relationships"],
    }

# ── Node 5: Analyze Gaps ───────────────────────────────────────────────────────
def analyze_gaps(state: AgentState) -> AgentState:
    papers = state["filtered_papers"]
    topic = state["user_input"]

    papers_text = "\n".join([
        f"- {p['title']}: {p['abstract'][:300]}"
        for p in papers
    ])

    messages = [
        SystemMessage(content="""You are a research strategist identifying gaps in a field.
Given a topic and a set of recent papers, identify:
1. 3-5 research gaps (questions the field hasn't answered)
2. 5 novel research questions a new researcher could pursue
Return as JSON: {"gaps": ["...", ...], "research_questions": ["...", ...]}
JSON only, no markdown."""),
        HumanMessage(content=f"Topic: {topic}\n\nPapers:\n{papers_text}"),
    ]

    response = llm.invoke(messages)
    try:
        parsed = json.loads(response.content.strip())
        gaps_text = "\n".join([f"• {g}" for g in parsed.get("gaps", [])])
        questions = parsed.get("research_questions", [])
    except json.JSONDecodeError:
        gaps_text = response.content
        questions = []

    return {
        **state,
        "gap_analysis": gaps_text,
        "research_questions": questions,
        "current_step": "generate_report",
        "steps_completed": state["steps_completed"] + ["analyze_gaps"],
    }


# ── Node 6: Generate State of Field Report ─────────────────────────────────────
def generate_report(state: AgentState) -> AgentState:
    papers = state["filtered_papers"]
    topic = state["user_input"]

    papers_summary = "\n".join([
        f"- [{p['published'][:4]}] {p['title']} by {', '.join(p['authors'][:2])}"
        for p in papers
    ])

    # Extract key authors
    from collections import Counter
    all_authors = []
    for p in papers:
        all_authors.extend(p["authors"][:3])
    top_authors = [{"name": a, "count": c} for a, c in Counter(all_authors).most_common(5)]

    messages = [
        SystemMessage(content="""You are a research synthesis expert.
Write a "State of the Field" report in 3 sections:
1. What's Solved (established results, consensus methods)
2. What's Contested (active debates, conflicting findings)  
3. What's Open (unsolved problems, future directions)
Be specific and cite paper titles when relevant. Write in academic but accessible prose.
Keep the full report under 600 words."""),
        HumanMessage(content=f"Topic: {topic}\n\nPapers:\n{papers_summary}\n\nGaps identified:\n{state['gap_analysis']}"),
    ]

    response = llm.invoke(messages)

    return {
        **state,
        "state_of_field": response.content,
        "key_authors": top_authors,
        "current_step": "complete",
        "steps_completed": state["steps_completed"] + ["generate_report"],
    }