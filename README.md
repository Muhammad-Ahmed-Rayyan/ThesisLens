# ThesisLens 🔬

**AI Research Intelligence Agent** — Automatically search, analyze, and synthesize academic research papers from ArXiv with interactive knowledge graph visualization.

![ThesisLens](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688)
![LangGraph](https://img.shields.io/badge/LangGraph-Latest-purple)
![D3.js](https://img.shields.io/badge/D3.js-7+-orange)

---

## 🌟 Features

- **🔍 Intelligent Search** — Search by research topic or ArXiv URL
- **🎯 Smart Filtering** — AI-powered relevance filtering
- **🕸️ Interactive Knowledge Graph** — D3.js force-directed visualization of paper relationships
- **🔬 Gap Analysis** — Identify research gaps in the field
- **📊 Field Overview** — Generate comprehensive state-of-the-field reports
- **❓ Research Questions** — AI-suggested research directions
- **👥 Key Authors** — Track influential researchers
- **⚡ Real-time Updates** — Live agent progress visualization with streaming

---

## 🏗️ Architecture

### Backend (FastAPI + LangGraph + Groq)
- **FastAPI** — High-performance async API
- **LangGraph** — Agentic workflow orchestration
- **Groq** — Ultra-fast LLM inference (Llama 3.1)
- **ArXiv API** — Academic paper database

### Frontend (React + Vite + Tailwind CSS + D3.js)
- **React 18** — Modern UI with hooks
- **Vite** — Lightning-fast dev server
- **Tailwind CSS v4** — Utility-first styling
- **D3.js** — Interactive force-directed graph visualization
- **Server-Sent Events (SSE)** — Real-time streaming

---

## 📁 Project Structure

```
ThesisLens/
├── backend/
│   ├── app/
│   │   ├── agent/          # LangGraph agent workflow
│   │   ├── routers/        # FastAPI routes
│   │   ├── services/       # ArXiv API integration
│   │   └── main.py         # FastAPI app entry
│   ├── .env.example        # Environment template
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── SearchBar.jsx
│   │   │   ├── AgentProgress.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── ReportPanel.jsx
│   │   │   ├── KeyAuthors.jsx
│   │   │   └── KnowledgeGraph.jsx  # D3.js visualization
│   │   ├── hooks/          # Custom hooks (SSE stream)
│   │   ├── App.jsx         # Main app component
│   │   └── index.css       # Tailwind styles
│   ├── index.html
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Groq API Key** ([Get it here](https://console.groq.com/keys))

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Ahmed-Rayyan/ThesisLens.git
cd ThesisLens
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux

# Add your Groq API key to .env
# GROQ_API_KEY=your_actual_key_here

# Start the backend server
uvicorn app.main:app --reload
```

Backend will run on: **http://localhost:8000**

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🎯 Usage

1. **Open your browser** to `http://localhost:5173`
2. **Enter a research topic** (e.g., "transformer neural networks") or **ArXiv URL**
3. **Click "Analyze Research"**
4. **Watch the AI agent work** through 6 steps:
   - 🔍 Planning search strategy
   - 📚 Fetching papers from ArXiv
   - 🎯 Filtering for relevance
   - 🕸️ Detecting relationships
   - 🔬 Analyzing research gaps
   - 📝 Generating report
5. **Explore results**:
   - **Interactive Knowledge Graph**: 
     - Visualize paper relationships in a force-directed network
     - Nodes sized by connection count, colored by research category
     - Drag nodes to rearrange, scroll to zoom, pan to explore
     - Click nodes to see full details in side panel
     - Hover edges to see relationship types (extends, contradicts, related, replicates)
   - **Papers List**: Browse papers with abstracts and PDF downloads
   - **State of the Field**: Read AI-generated field overview report
   - **Research Gaps**: Review identified gaps in current research
   - **Research Questions**: Discover potential research directions
   - **Key Authors**: See influential researchers ranked by paper count

---

## 🔧 Configuration

### Backend Environment Variables

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Configuration

- **API URL**: `http://localhost:8000` (hardcoded for development)
- **Max Papers**: 5, 8, 12, 15, or 20 (configurable in UI)

---

## 📊 API Endpoints

### `POST /api/research/analyze/stream`

Analyzes research papers and returns results via Server-Sent Events (SSE).

**Request Body:**
```json
{
  "input": "transformer architectures",
  "max_papers": 12
}
```

**Response Stream:**

Progress events:
```json
{
  "type": "progress",
  "step": "fetch_papers",
  "message": "📚 Fetching papers from ArXiv...",
  "papers_found": 0
}
```

Final result:
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

## 🎨 Design Philosophy

**Academic Journal Aesthetic**
- Sophisticated dark theme with deep charcoal backgrounds
- Typography: Crimson Pro (serif) + Source Sans 3 (sans-serif)
- Color palette: Warm amber and sage green accents
- Clean, scannable layouts inspired by academic journals

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend Framework** | FastAPI |
| **Agent Orchestration** | LangGraph |
| **LLM Provider** | Groq (Llama 3.1 8B Instant) |
| **Paper Database** | ArXiv API |
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Visualization** | D3.js v7 (Force-Directed Graph) |
| **Real-time Communication** | Server-Sent Events (SSE) |

---

## 🎨 Knowledge Graph Features

The interactive knowledge graph provides a visual representation of research paper relationships:

### **Graph Interactions**
- **Zoom & Pan** — Scroll to zoom, drag background to pan
- **Drag Nodes** — Click and drag papers to reposition
- **Click Nodes** — View detailed paper information in side panel
- **Hover Effects** — See tooltips and highlight connected papers

### **Visual Encoding**
- **Node Size** — Larger nodes have more connections (20-40px radius)
- **Node Color** — Color-coded by research category (cs.LG, cs.CV, cs.AI, etc.)
- **Edge Color** — Relationship type:
  - 🔵 Blue solid = **extends**
  - 🔴 Red solid = **contradicts**
  - ⚪ Gray dashed = **related**
  - 🟢 Green solid = **replicates**
- **Edge Thickness** — Higher confidence = thicker lines

### **Graph Physics**
- Force-directed layout with natural node positioning
- Collision detection prevents node overlap
- Interactive dragging updates simulation in real-time

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ArXiv** for providing open access to scientific papers
- **Groq** for ultra-fast LLM inference
- **LangGraph** for agent orchestration framework
- **FastAPI** for the excellent Python web framework
- **D3.js** for powerful data visualization capabilities

---

<div align="center">
  <p>⭐ Star this repo if you find it useful!</p>
</div>