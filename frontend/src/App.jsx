import { useResearchStream } from './hooks/useResearchStream';
import SearchBar from './components/SearchBar';
import AgentProgress from './components/AgentProgress';
import PaperCard from './components/PaperCard';
import ReportPanel from './components/ReportPanel';

function App() {
  const { steps, result, isLoading, error, runAnalysis } = useResearchStream();

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Header Section */}
      <header className="border-b border-gray-800 bg-card-bg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-3 mb-8">
            <h1 className="font-serif text-5xl font-bold text-text-primary tracking-tight">
              ThesisLens
            </h1>
            <p className="text-text-secondary text-lg">
              AI Research Intelligence Agent • Powered by LangGraph + ArXiv
            </p>
          </div>

          <SearchBar onSearch={runAnalysis} isLoading={isLoading} />
        </div>
      </header>

      {/* Main Content */}
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
              {/* Left Column: Papers Grid + Knowledge Graph Placeholder */}
              <div className="space-y-6">
                {/* Knowledge Graph Placeholder */}
                <div className="bg-card-bg rounded-lg border border-gray-700 p-8 h-80 flex items-center justify-center">
                  <div className="text-center text-text-secondary space-y-4">
                    <svg 
                      className="w-16 h-16 mx-auto opacity-50" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={1.5} 
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                      />
                    </svg>
                    <div>
                      <p className="font-serif text-lg font-semibold text-text-primary">
                        Knowledge Graph Visualization
                      </p>
                      <p className="text-sm mt-2">
                        D3.js Interactive Graph • Coming in Phase 2
                      </p>
                      <p className="text-xs mt-3 text-accent-amber">
                        {result.relationships?.length || 0} relationships detected
                      </p>
                    </div>
                  </div>
                </div>

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

        {/* Empty State */}
        {!isLoading && !result && !error && (
          <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
            <svg className="w-20 h-20 mx-auto text-accent-amber mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 className="font-serif text-3xl font-bold text-text-primary">
              Ready to Explore Research
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Enter a research topic or ArXiv URL above to begin analysis.
              <br />
              The AI agent will search, filter, and analyze relevant papers for you.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8 text-sm">
              {[
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  ), 
                  text: 'Smart Search' 
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ), 
                  text: 'Relevance Filter' 
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  ), 
                  text: 'Relationship Map' 
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  ), 
                  text: 'Gap Analysis' 
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ), 
                  text: 'Field Overview' 
                },
                { 
                  icon: (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ), 
                  text: 'Research Questions' 
                },
              ].map((feature) => (
                <div
                  key={feature.text}
                  className="p-4 bg-card-bg border border-gray-700 rounded-lg hover:border-accent-amber/50 transition-colors"
                >
                  <div className="text-accent-amber mb-2 flex justify-center">{feature.icon}</div>
                  <div className="text-text-secondary">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800 bg-card-bg/30">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-text-secondary text-sm">
          <p>
            Built with FastAPI • LangGraph • Groq • ArXiv API
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
