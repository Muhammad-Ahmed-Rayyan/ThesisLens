import { useState } from 'react';

export default function PaperCard({ paper }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayAuthors = paper.authors.slice(0, 3);
  const hasMoreAuthors = paper.authors.length > 3;

  const truncateAbstract = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-card-bg border border-gray-700 rounded-lg p-6 hover:border-accent-amber/50 transition-all duration-300 group">
      <div className="space-y-4">
        {/* Title */}
        <h3 className="font-serif text-xl font-semibold text-text-primary leading-tight">
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-amber transition-colors duration-200"
          >
            {paper.title}
          </a>
        </h3>

        {/* Authors and Year */}
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <p>
            {displayAuthors.join(', ')}
            {hasMoreAuthors && ` et al.`}
          </p>
          <span className="font-medium">
            {new Date(paper.published).getFullYear()}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {paper.categories.map((category) => (
            <span
              key={category}
              className="px-2 py-1 bg-accent-sage/10 text-accent-sage text-xs font-medium rounded border border-accent-sage/30"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Abstract */}
        <div className="text-sm text-text-secondary leading-relaxed">
          <p>
            {isExpanded ? paper.abstract : truncateAbstract(paper.abstract)}
          </p>
          {paper.abstract.length > 200 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-accent-amber hover:text-accent-amber/80 font-medium transition-colors duration-200"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-accent-amber/10 text-accent-amber 
                     border border-accent-amber/30 rounded-lg text-sm font-medium
                     hover:bg-accent-amber/20 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </a>

          <span className="text-xs text-text-secondary font-mono">
            {paper.arxiv_id}
          </span>
        </div>
      </div>
    </div>
  );
}
