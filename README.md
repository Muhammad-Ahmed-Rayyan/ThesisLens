<div align="center">
  <img src="https://github.com/Muhammad-Ahmed-Rayyan/ThesisLens/blob/main/ThesisLens.png" width="500">
  
  #
  
  <p><b>AI Research Intelligence Agent with Interactive Knowledge Graph Visualization</b></p>

![Last Commit](https://img.shields.io/github/last-commit/Muhammad-Ahmed-Rayyan/ThesisLens)
![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)
![React](https://img.shields.io/badge/React-19%2B-61DAFB?logo=react)
![languages](https://img.shields.io/github/languages/count/Muhammad-Ahmed-Rayyan/ThesisLens)

<br>

Built with the tools and technologies:

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black)
![LangGraph](https://img.shields.io/badge/LangGraph-6A0DAD?style=for-the-badge&logo=python&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-%23F9A03C.svg?style=for-the-badge&logo=d3dotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🧠 Project Summary

**ThesisLens** is an AI-powered research intelligence agent that automates the discovery and synthesis of academic literature. It leverages a **LangGraph**-orchestrated multi-step agent pipeline to fetch papers from **ArXiv**, filter them for relevance, map relationships, identify research gaps, and generate comprehensive field reports — all surfaced through a sleek, interactive **React** frontend with a **D3.js** force-directed knowledge graph.

---

## 🚀 Features

- 🔍 **Intelligent Search** — Search by research topic or ArXiv URL with AI-powered relevance filtering
- 🕸️ **Interactive Knowledge Graph** — D3.js force-directed visualization mapping relationships between papers
- 🔬 **Gap Analysis** — Automatically identifies unexplored areas and blind spots in the research field
- 📊 **Field Overview** — AI-generated state-of-the-field synthesis reports
- ❓ **Research Questions** — Suggested directions for future research
- 👥 **Key Authors** — Track and rank the most influential researchers
- ⚡ **Real-Time Streaming** — Live agent progress updates via Server-Sent Events (SSE)
- 🌀 **Cinematic Transitions** — Fullscreen loading sequence before entering the research workspace

---

## 🗃️ Project Structure

```bash
ThesisLens/
├── backend/
│   ├── app/
│   │   ├── agent/              # LangGraph agent workflow
│   │   ├── routers/            # FastAPI routes
│   │   ├── services/           # ArXiv API integration
│   │   └── main.py             # FastAPI app entry point
│   ├── .env.example            # Environment variable template
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AgentProgress.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── ReportPanel.jsx
│   │   │   ├── KeyAuthors.jsx
│   │   │   ├── KnowledgeGraph.jsx   # D3.js visualization
│   │   │   └── PageTransition.jsx   # Route transition overlay
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   └── ResearchPage.jsx
│   │   ├── hooks/
│   │   │   └── useResearchStream.js
│   │   ├── App.jsx             # Router and app shell
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind styles + theme tokens
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔧 Setup & Installation

> Make sure **Python 3.11+** and **Node.js 18+** are installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Ahmed-Rayyan/ThesisLens.git
cd ThesisLens
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

Backend will run on `http://localhost:8000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔑 API Configuration

### ⚙️ Environment Variables — `backend/.env`

Add your Groq API key to the `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Obtain your key from the [Groq Console](https://console.groq.com/keys).

---

## 📊 Agent Pipeline

The LangGraph agent processes your query through **6 sequential steps**:

| Step | Action |
|------|--------|
| 🔍 Step 1 | Plan search strategy |
| 📚 Step 2 | Fetch papers from ArXiv |
| 🎯 Step 3 | Filter for relevance |
| 🕸️ Step 4 | Detect paper relationships |
| 🔬 Step 5 | Analyze research gaps |
| 📝 Step 6 | Generate field report |

---

## 🕸️ Knowledge Graph

The interactive D3.js knowledge graph provides a visual representation of paper relationships.

### Graph Interactions
- **Zoom & Pan** — Scroll to zoom, drag the background to pan
- **Drag Nodes** — Reposition any paper node freely
- **Click Nodes** — View full paper details in a side panel
- **Hover Edges** — See relationship types between connected papers

### Visual Encoding

| Visual Property | Meaning |
|---|---|
| Node Size | Connection count (larger = more connections) |
| Node Color | Research category (cs.LG, cs.CV, cs.AI, etc.) |
| 🔵 Blue solid edge | extends |
| 🔴 Red solid edge | contradicts |
| ⚪ Gray dashed edge | related |
| 🟢 Green solid edge | replicates |
| Edge Thickness | Confidence score |

---

## 📡 API Reference

### `POST /api/research/analyze/stream`

Analyzes research papers and streams results via SSE.

**Request Body:**
```json
{
  "input": "transformer architectures",
  "max_papers": 12
}
```

**Progress Event:**
```json
{
  "type": "progress",
  "step": "fetch_papers",
  "message": "📚 Fetching papers from ArXiv...",
  "papers_found": 0
}
```

**Final Result:**
```json
{
  "type": "result",
  "papers": [...],
  "relationships": [...],
  "gap_analysis": "...",
  "research_questions": [...],
  "state_of_field": "...",
  "key_authors": [...]
}
```

### `GET /health`
Health check endpoint.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend Framework** | FastAPI |
| **Agent Orchestration** | LangGraph |
| **LLM Provider** | Groq (Llama 3.1 8B Instant) |
| **Paper Database** | ArXiv API |
| **Frontend Framework** | React 19 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Visualization** | D3.js v7 (Force-Directed Graph) |
| **Real-Time Comms** | Server-Sent Events (SSE) |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Muhammad-Ahmed-Rayyan/ThesisLens/blob/main/LICENSE.txt) file for details.

---

<div align="center">

⭐ Help the project grow by giving it a star!

</div>
