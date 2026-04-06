export default function KeyAuthors({ authors }) {
  if (!authors || authors.length === 0) return null;

  // Sort by count descending
  const sortedAuthors = [...authors].sort((a, b) => b.count - a.count);
  const topAuthors = sortedAuthors.slice(0, 10);

  return (
    <div className="space-y-3">
      <h3 className="font-serif text-lg font-semibold text-text-primary">
        Key Authors
      </h3>

      <div className="space-y-2">
        {topAuthors.map((author, index) => (
          <div
            key={`${author.name}-${index}`}
            className="flex items-center justify-between p-3 bg-page-bg rounded-lg border border-gray-700/50
                     hover:border-accent-sage/50 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 
                           bg-accent-sage/20 text-accent-sage text-sm font-bold rounded-full">
                {index + 1}
              </span>
              <span className="text-text-primary text-sm font-medium">
                {author.name}
              </span>
            </div>

            <span className="px-3 py-1 bg-accent-amber/10 text-accent-amber text-xs font-semibold rounded-full">
              {author.count} {author.count === 1 ? 'paper' : 'papers'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
