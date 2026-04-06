import { useState } from 'react';

export default function SearchBar({ onSearch, isLoading }) {
  const [input, setInput] = useState('');
  const [maxPapers, setMaxPapers] = useState(12);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim(), maxPapers);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter research topic or ArXiv URL (e.g., 'transformer architectures' or 'https://arxiv.org/abs/1706.03762')"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-card-bg border border-gray-700 rounded-lg 
                     text-text-primary placeholder-text-secondary
                     focus:outline-none focus:ring-2 focus:ring-accent-amber focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="maxPapers" className="text-sm text-text-secondary">
              Max papers:
            </label>
            <select
              id="maxPapers"
              value={maxPapers}
              onChange={(e) => setMaxPapers(Number(e.target.value))}
              disabled={isLoading}
              className="px-4 py-2 bg-card-bg border border-gray-700 rounded-lg
                       text-text-primary text-sm
                       focus:outline-none focus:ring-2 focus:ring-accent-amber focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-8 py-3 bg-accent-amber text-page-bg font-semibold rounded-lg
                     hover:bg-opacity-90 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2 focus:ring-offset-page-bg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
      </form>

      {input.trim() && !isLoading && (
        <p className="mt-3 text-xs text-text-secondary text-right flex items-center justify-end gap-2">
          {input.includes('arxiv.org') ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ArXiv URL detected
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Research topic detected
            </>
          )}
        </p>
      )}
    </div>
  );
}
