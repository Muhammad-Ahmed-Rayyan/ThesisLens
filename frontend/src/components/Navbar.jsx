import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onLaunch }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', onScroll);
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-16 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-[#3b434c] bg-[#0d1117]/95 backdrop-blur-md'
          : 'border-[#30363d] bg-[#0d1117]/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-text-primary"
        >
          ThesisLens
        </Link>

        <button
          type="button"
          onClick={onLaunch}
          className="rounded-lg border border-accent-amber px-4 py-2 text-sm font-semibold text-accent-amber transition-colors hover:bg-accent-amber hover:text-page-bg"
        >
          Launch Research
        </button>
      </div>
    </header>
  );
}
