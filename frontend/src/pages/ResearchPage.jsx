import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResearchStream } from '../hooks/useResearchStream';
import AgentProgress from '../components/AgentProgress';
import PaperCard from '../components/PaperCard';
import ReportPanel from '../components/ReportPanel';
import KnowledgeGraph from '../components/KnowledgeGraph';

export default function ResearchPage() {
  const navigate = useNavigate();
  const { steps, result, isLoading, error, runAnalysis } = useResearchStream();
  const [input, setInput] = useState('');
  const [maxPapers, setMaxPapers] = useState(12);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const paperOptions = [5, 8, 10, 12, 15, 20];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      runAnalysis(input.trim(), maxPapers);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 text-text-primary">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-8 text-sm font-medium text-text-secondary transition-colors hover:text-accent-amber"
      >
        ← Home
      </button>

      <section className="mb-10 border-b border-subtle pb-10">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-text-primary">
              Explore a Research Field
            </h1>
            <p className="text-base leading-relaxed text-text-secondary">
              Enter a topic or ArXiv paper URL to run a structured, AI-guided literature analysis.
            </p>
          </div>

          <div className="rounded-2xl border border-subtle bg-card p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter research topic or ArXiv URL (e.g., 'transformer architectures' or 'https://arxiv.org/abs/1706.03762')"
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-700 bg-card-bg px-6 py-4 text-text-primary placeholder-text-secondary transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-amber disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary">Max papers:</span>

                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setIsDropdownOpen((open) => !open)}
                      className="flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#1c2128] px-4 py-2 text-sm text-[#e6edf3] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>{maxPapers} papers</span>
                      <span className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute left-0 top-full z-50 mt-2 min-w-full rounded-lg border border-[#30363d] bg-[#1c2128] py-1 shadow-lg">
                        {paperOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setMaxPapers(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[#30363d] ${
                              maxPapers === option ? 'text-[#c9a84c]' : 'text-[#e6edf3]'
                            }`}
                          >
                            <span>{option} papers</span>
                            {maxPapers === option && <span>✓</span>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-accent-amber px-8 py-3 font-semibold text-page-bg transition-all duration-200 hover:bg-opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2 focus:ring-offset-page-bg"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Research'
                  )}
                </button>
              </div>

              {input.trim() && !isLoading && (
                <p className="mt-3 flex items-center justify-end gap-2 text-right text-xs text-text-secondary">
                  {input.includes('arxiv.org') ? (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      ArXiv URL detected
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Research topic detected
                    </>
                  )}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-700 bg-red-900/20 p-6">
          <div className="flex items-start gap-3">
            <svg className="h-6 w-6 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold text-red-400">
                Analysis Error
              </h2>
              <p className="text-text-secondary">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && steps.length > 0 && (
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-2xl font-semibold text-text-primary">
              Analysis in Progress
            </h2>
            <p className="text-text-secondary">
              Watch the AI agent work through each step
            </p>
          </div>
          <AgentProgress steps={steps} />
        </div>
      )}

      {result && !isLoading && (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-2 text-center">
            <h2 className="font-display text-3xl font-bold text-text-primary">
              Analysis Complete
            </h2>
            <p className="text-text-secondary">
              Found {result.papers.length} relevant papers
              {result.search_query && (
                <span className="ml-2 text-accent-amber">
                  · Query: "{result.search_query}"
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <KnowledgeGraph
                papers={result.papers}
                relationships={result.relationships}
              />

              <div className="space-y-4">
                <h3 className="font-display text-2xl font-bold text-text-primary">
                  Research Papers
                </h3>
                <div className="space-y-4">
                  {result.papers.map((paper) => (
                    <PaperCard key={paper.arxiv_id} paper={paper} />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[calc(100vh-8rem)] lg:sticky lg:top-24">
              <ReportPanel result={result} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
