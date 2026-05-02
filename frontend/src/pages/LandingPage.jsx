import { useNavigate } from 'react-router-dom';

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

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="text-text-primary">
      <section className="hero-bg relative overflow-hidden border-b border-subtle">
        <div className="hero-overlay absolute inset-0 pointer-events-none" />
        <div className="relative z-10 min-h-[calc(100vh-64px)] px-6">
          <div className="mx-auto flex h-full min-h-[calc(100vh-64px)] w-full max-w-5xl flex-col items-center justify-center text-center">
            <p className="mb-8 inline-flex rounded-full border border-subtle bg-card/70 px-4 py-2 text-xs font-medium tracking-wide text-text-secondary">
              Powered by LangGraph · ArXiv · Groq
            </p>

            <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-text-primary md:text-7xl">
              Understand Any Research Field. In Minutes.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary md:text-xl">
              ThesisLens autonomously fetches, filters, and maps research papers — revealing gaps, relationships, and the state of any field.
            </p>

            <button
              type="button"
              onClick={() => navigate('/research')}
              className="mt-10 inline-flex items-center gap-2 rounded-lg border border-accent-amber bg-transparent px-6 py-3 text-sm font-semibold tracking-wide text-accent-amber transition-colors hover:bg-accent-amber hover:text-page-bg"
            >
              Start Exploring
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-page-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20">
          <h2 className="font-display text-center text-4xl font-semibold tracking-tight text-text-primary">
            What ThesisLens Does
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.name}
                className="feature-card rounded-xl border border-subtle border-l-2 border-l-amber-500 bg-card p-6"
              >
                <div className="mb-4 text-accent-amber">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-text-primary">{feature.name}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
