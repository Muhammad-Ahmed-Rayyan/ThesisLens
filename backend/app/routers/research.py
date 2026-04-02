from fastapi import APIRouter, HTTPException
from app.agent.state import ResearchRequest, PapersResponse, PaperSchema
from app.services.arxiv_service import fetch_papers, fetch_paper_by_url

router = APIRouter(prefix="/api/research", tags=["research"])


def is_arxiv_url(text: str) -> bool:
    return "arxiv.org" in text


@router.post("/papers", response_model=PapersResponse)
async def get_papers(request: ResearchRequest):
    try:
        if is_arxiv_url(request.input):
            # Single paper lookup — use its title as seed for related paper search
            seed_paper = fetch_paper_by_url(request.input)
            if not seed_paper:
                raise HTTPException(status_code=404, detail="Paper not found")

            # Search for related papers using the seed paper's title keywords
            query = " ".join(seed_paper.title.split()[:6])  # First 6 words
            papers = fetch_papers(query, max_results=request.max_papers)

            # Make sure the seed paper itself is included
            seed_ids = {p.arxiv_id for p in papers}
            if seed_paper.arxiv_id not in seed_ids:
                papers.insert(0, seed_paper)

        else:
            papers = fetch_papers(request.input, max_results=request.max_papers)
            query = request.input

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