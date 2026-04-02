from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import research

app = FastAPI(
    title="ThesisLens API",
    description="AI Research Intelligence Agent",
    version="0.1.0",
)

# CORS — allows React frontend (localhost:5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://thesislens.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(research.router)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "ThesisLens API"}