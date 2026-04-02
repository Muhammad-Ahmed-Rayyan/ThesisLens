import sys
import os

# Add the backend root to path so we can import app
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.arxiv_service import fetch_papers, fetch_paper_by_url


def test_topic_search():
    print("\n=== Testing topic search ===")
    papers = fetch_papers("transformer architectures for time series", max_results=5)

    assert len(papers) > 0, "Should return at least one paper"

    for i, paper in enumerate(papers):
        print(f"\n[{i+1}] {paper.title}")
        print(f"    Authors: {', '.join(paper.authors[:3])}")
        print(f"    Published: {paper.published}")
        print(f"    ArXiv ID: {paper.arxiv_id}")
        print(f"    URL: {paper.url}")
        print(f"    Abstract (first 200 chars): {paper.abstract[:200]}...")

    print(f"\n✓ Fetched {len(papers)} papers successfully")


def test_url_fetch():
    print("\n=== Testing URL fetch ===")
    # A well-known paper: Attention Is All You Need
    url = "https://arxiv.org/abs/1706.03762"
    paper = fetch_paper_by_url(url)

    assert paper is not None, "Should find the paper"
    assert "Attention" in paper.title, "Should be the Attention paper"

    print(f"Title: {paper.title}")
    print(f"Authors: {', '.join(paper.authors[:3])}")
    print(f"Published: {paper.published}")
    print(f"✓ URL fetch works")


if __name__ == "__main__":
    test_topic_search()
    test_url_fetch()
    print("\n✅ All tests passed")