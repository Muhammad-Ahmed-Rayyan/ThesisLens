from langgraph.graph import StateGraph, END
from app.agent.state import AgentState
from app.agent.nodes import analyze_gaps, generate_report
from app.agent.nodes import (
    plan_search,
    fetch_papers_node,
    filter_relevance,
    detect_relationships,
)


def build_agent_graph():
    graph = StateGraph(AgentState)

    # Register nodes
    graph.add_node("plan_search", plan_search)
    graph.add_node("fetch_papers", fetch_papers_node)
    graph.add_node("filter_relevance", filter_relevance)
    graph.add_node("detect_relationships", detect_relationships)
    graph.add_node("analyze_gaps", analyze_gaps)
    graph.add_node("generate_report", generate_report)

    # Define edges (linear for now)
    graph.set_entry_point("plan_search")
    graph.add_edge("plan_search", "fetch_papers")
    graph.add_edge("fetch_papers", "filter_relevance")
    graph.add_edge("filter_relevance", "detect_relationships")
    graph.add_edge("detect_relationships", "analyze_gaps")
    graph.add_edge("analyze_gaps", "generate_report")
    graph.add_edge("generate_report", END)

    return graph.compile()


# Singleton — compile once at startup
agent = build_agent_graph()