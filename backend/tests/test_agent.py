import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.agent.graph import agent
from app.agent.state import AgentState

def test_agent_topic():
    initial_state: AgentState = {
        "user_input": "attention mechanisms in transformers",
        "max_papers": 5,
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

    result = agent.invoke(initial_state)

    print(f"\nSearch query used: {result['search_query']}")
    print(f"Raw papers fetched: {len(result['raw_papers'])}")
    print(f"Filtered papers: {len(result['filtered_papers'])}")
    print(f"Relationships found: {len(result['relationships'])}")
    print(f"Steps completed: {result['steps_completed']}")

    for r in result['relationships'][:3]:
        print(f"  → {r['source_id']} --[{r['relationship']}]--> {r['target_id']}")

    assert len(result["filtered_papers"]) > 0
    print("\n✅ Agent test passed")

if __name__ == "__main__":
    test_agent_topic()