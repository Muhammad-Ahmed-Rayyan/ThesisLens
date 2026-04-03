import json
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.agent.state import ResearchRequest, PapersResponse, PaperSchema, AgentState
from app.services.arxiv_service import fetch_papers, fetch_paper_by_url
from app.agent.graph import agent

router = APIRouter(prefix="/api/research", tags=["research"])

STEP_MESSAGES = {
    "plan_search": "🔍 Planning search strategy...",
    "fetch_papers": "📚 Fetching papers from ArXiv...",
    "filter_relevance": "🎯 Filtering for relevance...",
    "detect_relationships": "🕸️ Detecting relationships between papers...",
    "analyze_gaps": "🔬 Analyzing research gaps...",
    "generate_report": "📝 Generating State of the Field report...",
    "complete": "✅ Analysis complete!",
}


def is_arxiv_url(text: str) -> bool:
    return "arxiv.org" in text


# ── Endpoint 1: Simple paper fetch (existing) ──────────────────────────────────
@router.post("/papers", response_model=PapersResponse)
async def get_papers(request: ResearchRequest):
    try:
        if is_arxiv_url(request.input):
            seed_paper = fetch_paper_by_url(request.input)
            if not seed_paper:
                raise HTTPException(status_code=404, detail="Paper not found")
            query = " ".join(seed_paper.title.split()[:6])
            papers = fetch_papers(query, max_results=request.max_papers)
            seed_ids = {p.arxiv_id for p in papers}
            if seed_paper.arxiv_id not in seed_ids:
                papers.insert(0, seed_paper)
        else:
            papers = fetch_papers(request.input, max_results=request.max_papers)

        paper_schemas = [PaperSchema(**p.__dict__) for p in papers]
        return PapersResponse(
            papers=paper_schemas,
            query_used=request.input,
            total_found=len(paper_schemas),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Endpoint 2: Full agent with SSE streaming (new) ────────────────────────────
@router.post("/analyze/stream")
async def analyze_stream(request: dict):
    user_input = request.get("input", "")
    max_papers = request.get("max_papers", 12)

    async def event_generator():
        initial_state: AgentState = {
            "user_input": user_input,
            "max_papers": max_papers,
            "search_query": "",
            "raw_papers": [],
            "filtered_papers": [],
            "relationships": [],
            "gap_analysis": "",
            "research_questions": [],
            "state_of_field": "",
            "key_authors": [],
            "current_step": "plan_search",
            "steps_completed": [],
            "error": None,
        }

        try:
            for step_output in agent.stream(initial_state):
                node_name = list(step_output.keys())[0]
                state_after = step_output[node_name]

                message = STEP_MESSAGES.get(node_name, f"Running {node_name}...")
                papers_count = len(state_after.get("filtered_papers", state_after.get("raw_papers", [])))

                progress_event = {
                    "type": "progress",
                    "step": node_name,
                    "message": message,
                    "papers_found": papers_count,
                }
                yield f"data: {json.dumps(progress_event)}\n\n"
                await asyncio.sleep(0.1)

            final_state = agent.invoke(initial_state)

            result_event = {
                "type": "result",
                "papers": final_state["filtered_papers"],
                "relationships": final_state["relationships"],
                "gap_analysis": final_state["gap_analysis"],
                "research_questions": final_state["research_questions"],
                "state_of_field": final_state["state_of_field"],
                "key_authors": final_state["key_authors"],
                "search_query": final_state["search_query"],
            }
            yield f"data: {json.dumps(result_event)}\n\n"

        except Exception as e:
            error_event = {"type": "error", "message": str(e)}
            yield f"data: {json.dumps(error_event)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )