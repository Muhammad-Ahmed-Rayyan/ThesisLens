from pydantic import BaseModel
from typing import Optional, TypedDict


# --- API schemas (unchanged) ---
class PaperSchema(BaseModel):
    arxiv_id: str
    title: str
    abstract: str
    authors: list[str]
    url: str
    published: str
    categories: list[str]
    pdf_url: str


class ResearchRequest(BaseModel):
    input: str
    max_papers: int = 12


class PapersResponse(BaseModel):
    papers: list[PaperSchema]
    query_used: str
    total_found: int


# --- Agent internal state ---
class RelationshipEdge(TypedDict):
    source_id: str
    target_id: str
    relationship: str   # "cites", "extends", "contradicts", "replicates", "related"
    confidence: float


class AgentState(TypedDict):
    # Input
    user_input: str           # Raw topic or URL
    max_papers: int

    # Intermediate
    search_query: str         # Refined query used for ArXiv
    raw_papers: list[dict]    # All fetched papers (before filtering)
    filtered_papers: list[dict]  # After relevance filtering
    relationships: list[RelationshipEdge]

    # Output
    gap_analysis: str
    research_questions: list[str]
    state_of_field: str
    key_authors: list[dict]

    # Progress tracking (for SSE streaming)
    current_step: str
    steps_completed: list[str]
    error: Optional[str]