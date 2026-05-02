import { useResearchStream } from './hooks/useResearchStream';
import SearchBar from './components/SearchBar';
import AgentProgress from './components/AgentProgress';
import PaperCard from './components/PaperCard';
import ReportPanel from './components/ReportPanel';
import KnowledgeGraph from './components/KnowledgeGraph';

const FEATURES = [
  {
    name: 'Smart Search',
    description: 'Refines your topic into optimal ArXiv queries automatically',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    name: 'Relevance Filter',
    description: 'Scores and keeps only the most relevant papers using AI',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'Relationship Map',
    description: 'Detects how papers extend, contradict, or replicate each other',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    name: 'Gap Analysis',
    description: "Identifies what questions the field hasn't answered yet",
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    name: 'Field Overview',
    description: 'Generates a structured State of the Field report',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Research Questions',
    description: 'Suggests novel research directions based on gap analysis',
    icon: (
      <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function App() {
  const { steps, result, isLoading, error, runAnalysis } = useResearchStream();
  const showLanding = !isLoading && !result && !error;

  return (
    <div className="min-h-screen bg-page-bg text-text-primary">
      {showLanding ? (
        <>
          <section className="hero-bg relative min-h-screen overflow-hidden border-b border-subtle">
            <div className="hero-overlay absolute inset-0 pointer-events-none" />

            <div className="relative z-10 flex min-h-screen flex-col">
              <header className="px-6 py-6">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
                  <p className="font-serif text-2xl font-semibold tracking-tight text-text-primary">
                    ThesisLens
                  </p>
                </div>
              </header>

              <div className="flex flex-1 items-center px-6 pb-16">
                <div className="mx-auto w-full max-w-7xl">
                  <div className="max-w-3xl space-y-8">
                    <p className="inline-flex rounded-full border border-subtle bg-card/70 px-4 py-2 text-xs font-medium tracking-wide text-text-secondary">
                      Powered by LangGraph · ArXiv · Groq
                    </p>

                    <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl">
                      Understand Any Research Field. In Minutes.
                    </h1>

                    <p className="max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                      ThesisLens autonomously fetches, filters, and maps research papers — revealing gaps, relationships, and the state of any field.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-accent-amber bg-accent-amber/10 px-6 py-3 text-sm font-semibold tracking-wide text-accent-amber transition-colors hover:border-accent-amber-bright hover:text-accent-amber-bright"
                    >
                      Start Exploring
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="search-section" className="border-b border-subtle bg-secondary/70">
            <div className="mx-auto w-full max-w-7xl px-6 py-20">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-3">
                  <h2 className="font-serif text-4xl font-semibold tracking-tight text-text-primary">
                    Explore a Research Field
                  </h2>
                  <p className="text-base leading-relaxed text-text-secondary">
                    Enter a topic or ArXiv paper URL to run a structured, AI-guided literature analysis.
                  </p>
                </div>

                <div className="rounded-2xl border border-subtle bg-card p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] md:p-8">
                  <SearchBar onSearch={runAnalysis} isLoading={isLoading} />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-page-bg">
            <div className="mx-auto w-full max-w-7xl px-6 py-20">
              <div className="mb-10 max-w-3xl space-y-3">
                <h3 className="font-serif text-3xl font-semibold tracking-tight text-text-primary">
                  Research Intelligence Workflow
                </h3>
                <p className="text-text-secondary">
                  ThesisLens combines retrieval, filtering, and synthesis into one academic-grade analysis pipeline.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {FEATURES.map((feature) => (
                  <article
                    key={feature.name}
                    className="feature-card rounded-xl border border-subtle border-l-4 border-l-accent-amber bg-card p-6"
                  >
                    <div className="mb-4 text-accent-amber">{feature.icon}</div>
                    <h4 className="mb-2 text-lg font-semibold text-text-primary">{feature.name}</h4>
                    <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <header className="border-b border-subtle bg-card">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="mb-8 space-y-3 text-center">
              <h1 className="font-serif text-5xl font-bold tracking-tight text-text-primary">
                ThesisLens
              </h1>
              <p className="text-lg text-text-secondary">
                AI Research Intelligence Agent • Powered by LangGraph + ArXiv
              </p>
            </div>

            <SearchBar onSearch={runAnalysis} isLoading={isLoading} />
          </div>
        </header>
      )}

      {!showLanding && (
        <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-serif text-lg font-semibold text-red-400 mb-2">
                  Analysis Error
                </h3>
                <p className="text-text-secondary">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State - Agent Progress */}
        {isLoading && steps.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl font-semibold text-text-primary mb-2">
                Analysis in Progress
              </h2>
              <p className="text-text-secondary">
                Watch the AI agent work through each step
              </p>
            </div>
            <AgentProgress steps={steps} />
          </div>
        )}

        {/* Results State */}
        {result && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Results Header */}
            <div className="text-center space-y-2">
              <h2 className="font-serif text-3xl font-bold text-text-primary">
                Analysis Complete
              </h2>
              <p className="text-text-secondary">
                Found {result.papers.length} relevant papers
                {result.search_query && (
                  <span className="ml-2 text-accent-amber">
                    • Query: "{result.search_query}"
                  </span>
                )}
              </p>
            </div>

            {/* Split Layout: Papers + Report */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Column: Papers Grid + Knowledge Graph */}
              <div className="space-y-6">
                {/* Knowledge Graph */}
                <KnowledgeGraph 
                  papers={result.papers} 
                  relationships={result.relationships} 
                />

                {/* Papers Grid */}
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-bold text-text-primary">
                    Research Papers
                  </h3>
                  <div className="space-y-4">
                    {result.papers.map((paper) => (
                      <PaperCard key={paper.arxiv_id} paper={paper} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Report Panel */}
              <div className="lg:sticky lg:top-24 h-[calc(100vh-8rem)]">
                <ReportPanel result={result} />
              </div>
            </div>
          </div>
        )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-subtle bg-card/20">
        <div className="max-w-7xl mx-auto px-6 py-7 text-center text-text-secondary text-sm">
          <p>
            Built with FastAPI · LangGraph · Groq · ArXiv API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
