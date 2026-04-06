import { useState } from 'react';
import KeyAuthors from './KeyAuthors';

export default function ReportPanel({ result }) {
  const [activeTab, setActiveTab] = useState('field');

  const tabs = [
    { 
      id: 'field', 
      label: 'State of the Field', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'gaps', 
      label: 'Research Gaps', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    { 
      id: 'questions', 
      label: 'Research Questions', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'authors', 
      label: 'Key Authors', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  const parseGapAnalysis = (text) => {
    if (!text) return [];
    return text
      .split('\n')
      .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
      .map(line => line.replace(/^[•\-]\s*/, '').trim());
  };

  const gaps = parseGapAnalysis(result.gap_analysis);

  return (
    <div className="bg-card-bg border border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-page-bg/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${activeTab === tab.id
                ? 'text-accent-amber border-b-2 border-accent-amber bg-card-bg/50'
                : 'text-text-secondary hover:text-text-primary hover:bg-card-bg/30'
              }
            `}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'field' && (
          <div className="prose prose-invert prose-amber max-w-none">
            <article 
              className="text-text-secondary leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ 
                __html: result.state_of_field
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/, '<p>')
                  .replace(/$/, '</p>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />
          </div>
        )}

        {activeTab === 'gaps' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">
              Identified Research Gaps
            </h3>
            {gaps.length > 0 ? (
              <ul className="space-y-4">
                {gaps.map((gap, index) => (
                  <li
                    key={index}
                    className="flex gap-4 p-4 bg-page-bg rounded-lg border border-gray-700/50"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                                   bg-accent-amber/20 text-accent-amber font-bold rounded-full text-sm">
                      {index + 1}
                    </span>
                    <p className="text-text-secondary leading-relaxed">{gap}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-text-secondary italic">No specific gaps identified.</p>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-semibold text-text-primary mb-6">
              Potential Research Questions
            </h3>
            {result.research_questions && result.research_questions.length > 0 ? (
              <ol className="space-y-4">
                {result.research_questions.map((question, index) => (
                  <li
                    key={index}
                    className="flex gap-4 p-4 bg-page-bg rounded-lg border border-gray-700/50"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center 
                                   bg-accent-sage/20 text-accent-sage font-bold rounded-full text-sm">
                      {index + 1}
                    </span>
                    <p className="text-text-primary leading-relaxed font-medium">{question}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-text-secondary italic">No research questions generated.</p>
            )}
          </div>
        )}

        {activeTab === 'authors' && (
          <KeyAuthors authors={result.key_authors} />
        )}
      </div>
    </div>
  );
}
