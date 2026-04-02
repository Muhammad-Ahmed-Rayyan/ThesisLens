import arxiv
from dataclasses import dataclass
from typing import Optional


@dataclass
class Paper:
    arxiv_id: str
    title: str
    abstract: str
    authors: list[str]
    url: str
    published: str
    categories: list[str]
    pdf_url: str


def fetch_papers(query: str, max_results: int = 15) -> list[Paper]:
    """
    Fetch papers from ArXiv given a search query.
    Returns a list of Paper dataclass instances.
    """
    client = arxiv.Client()

    search = arxiv.Search(
        query=query,
        max_results=max_results,
        sort_by=arxiv.SortCriterion.Relevance,
    )

    papers = []
    for result in client.results(search):
        paper = Paper(
            arxiv_id=result.entry_id.split("/")[-1],  # e.g. "2301.07041v2"
            title=result.title.strip(),
            abstract=result.summary.strip(),
            authors=[str(a) for a in result.authors],
            url=result.entry_id,
            published=result.published.strftime("%Y-%m-%d"),
            categories=result.categories,
            pdf_url=result.pdf_url,
        )
        papers.append(paper)

    return papers


def fetch_paper_by_url(arxiv_url: str) -> Optional[Paper]:
    """
    Fetch a single paper by its ArXiv URL.
    Handles both abstract URLs and PDF URLs.
    """
    # Extract the ID from various URL formats:
    # https://arxiv.org/abs/2301.07041
    # https://arxiv.org/pdf/2301.07041
    arxiv_id = arxiv_url.rstrip("/").split("/")[-1]
    # Strip version suffix if present for search (e.g. 2301.07041v2 -> 2301.07041)
    base_id = arxiv_id.split("v")[0]

    client = arxiv.Client()
    search = arxiv.Search(id_list=[base_id])

    for result in client.results(search):
        return Paper(
            arxiv_id=arxiv_id,
            title=result.title.strip(),
            abstract=result.summary.strip(),
            authors=[str(a) for a in result.authors],
            url=result.entry_id,
            published=result.published.strftime("%Y-%m-%d"),
            categories=result.categories,
            pdf_url=result.pdf_url,
        )

    return None