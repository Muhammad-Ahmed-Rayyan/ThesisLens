import { useNavigate } from 'react-router-dom';
import { useResearchStream } from '../hooks/useResearchStream';
import SearchBar from '../components/SearchBar';
import AgentProgress from '../components/AgentProgress';
import PaperCard from '../components/PaperCard';
import ReportPanel from '../components/ReportPanel';
import KnowledgeGraph from '../components/KnowledgeGraph';

export default function ResearchPage() {
  const navigate = useNavigate();
  const { steps, result, isLoading, error, runAnalysis } = useResearchStream();

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
            <SearchBar onSearch={runAnalysis} isLoading={isLoading} />
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
