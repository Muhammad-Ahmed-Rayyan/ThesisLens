import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

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

const STATS = [
  { key: 'steps', value: 6, suffix: '', label: 'Agent Steps', animated: true },
  { key: 'papers', value: 15, suffix: '+', label: 'Papers Analyzed Per Query', animated: true },
  { key: 'gaps', value: '3–5', label: 'Research Gaps Identified', animated: false },
  { key: 'open', value: '100%', label: 'Free & Open Source', animated: false },
];

const USE_CASES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: 'The Student',
    description:
      "Entering a new research area for your thesis? ThesisLens maps the entire landscape in minutes — showing you what's settled, what's debated, and where your contribution could live.",
    tag: 'Thesis Research',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0 0-14h-1" />
        <path d="M9 14h2" />
        <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
        <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
      </svg>
    ),
    title: 'The Researcher',
    description:
      'Doing a literature review before a new project? Skip the manual paper-by-paper reading. Get a structured State of the Field report with gap analysis instantly.',
    tag: 'Literature Reviews',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
        <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M12 2v2" />
        <path d="M12 22v-2" />
        <path d="m17 20.66-1-1.73" />
        <path d="M11 10.27 7 3.34" />
        <path d="m20.66 17-1.73-1" />
        <path d="m3.34 7 1.73 1" />
        <path d="M14 12h8" />
        <path d="M2 12h2" />
        <path d="m20.66 7-1.73 1" />
        <path d="m3.34 17 1.73-1" />
        <path d="m17 3.34-1 1.73" />
        <path d="m11 13.73-4 6.93" />
      </svg>
    ),
    title: 'The Engineer',
    description:
      "Evaluating the research landscape before building an AI system? Understand which techniques are proven, which are contested, and what novel approaches haven't been tried.",
    tag: 'Technical Due Diligence',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);
  const [counts, setCounts] = useState({ steps: 0, papers: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = () => {
    setIsTransitioning(true);
  };

  useEffect(() => {
    const target = statsRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsInView) return;

    let frameId;
    const duration = 1500;
    const start = performance.now();
    const easeOutCubic = (t) => 1 - (1 - t) ** 3;

    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(progress);

      setCounts({
        steps: Math.round(6 * eased),
        papers: Math.round(15 * eased),
      });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [statsInView]);

  return (
    <div className="text-text-primary">
      <Navbar onLaunch={handleNavigate} />

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
              onClick={handleNavigate}
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

      <section ref={statsRef} className="bg-[#161b22] py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              ThesisLens by the Numbers
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-[60px] bg-[#c9a84c]" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.key}
                className={`px-4 text-center ${index < 3 ? 'md:border-r md:border-gray-700' : ''}`}
              >
                <div
                  className={`font-display text-5xl font-bold text-[#c9a84c] transition-all duration-700 ${
                    statsInView ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                  }`}
                >
                  {stat.animated
                    ? `${counts[stat.key]}${stat.suffix}`
                    : stat.value}
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[#8b949e] md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0d1117] py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
              Built for Curious Minds
            </h2>
            <div className="mx-auto mt-4 h-[2px] w-[60px] bg-[#c9a84c]" />
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-text-secondary md:text-lg">
              Whether you&apos;re entering a new field or going deep into one — ThesisLens accelerates your research.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {USE_CASES.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-subtle border-t-2 border-t-[#c9a84c] bg-[#1c2128] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-t-[#e0bc6a]"
              >
                <div className="leading-none text-accent-amber">{item.icon}</div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-text-primary">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-text-secondary">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex rounded-full border border-[#c9a84c] bg-transparent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#c9a84c]">
                  {item.tag}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {isTransitioning && (
        <PageTransition onComplete={() => navigate('/research')} />
      )}
    </div>
  );
}
