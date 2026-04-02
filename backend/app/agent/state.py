from pydantic import BaseModel
from typing import Optional


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
    input: str          # Either a topic string OR an ArXiv URL
    max_papers: int = 12


class PapersResponse(BaseModel):
    papers: list[PaperSchema]
    query_used: str
    total_found: int