export default function AgentProgress({ steps }) {
  const stepConfig = {
    plan_search: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Planning search'
    },
    fetch_papers: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      label: 'Fetching papers'
    },
    filter_relevance: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Filtering relevance'
    },
    detect_relationships: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      label: 'Detecting relationships'
    },
    analyze_gaps: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      label: 'Analyzing gaps'
    },
    generate_report: {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: 'Generating report'
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {steps.map((step, index) => {
        const isCompleted = index < steps.length - 1;
        const isCurrent = index === steps.length - 1;
        const config = stepConfig[step.step] || { icon: null, label: step.step };

        return (
          <div
            key={`${step.step}-${index}`}
            className={`
              flex items-start gap-4 p-4 rounded-lg border transition-all duration-500
              ${isCompleted 
                ? 'bg-card-bg/50 border-accent-sage/30 opacity-75' 
                : 'bg-card-bg border-accent-amber animate-slide-up'
              }
            `}
          >
            <div className={`
              text-accent-amber transition-all duration-300
              ${isCurrent ? 'animate-pulse' : 'text-accent-sage'}
            `}>
              {config.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className={`
                  font-serif text-lg
                  ${isCompleted ? 'text-text-secondary' : 'text-text-primary font-semibold'}
                `}>
                  {step.message}
                </p>
                
                {step.papers_found > 0 && (
                  <span className="px-3 py-1 bg-accent-sage/20 text-accent-sage text-sm font-medium rounded-full whitespace-nowrap">
                    {step.papers_found} papers
                  </span>
                )}
              </div>

              {isCompleted && (
                <div className="mt-2 h-1 bg-accent-sage/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-sage rounded-full w-full animate-fade-in" />
                </div>
              )}
              
              {isCurrent && (
                <div className="mt-2 h-1 bg-accent-amber/20 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-amber rounded-full w-2/3 animate-pulse" />
                </div>
              )}
            </div>

            {isCompleted && (
              <div className="text-accent-sage text-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
