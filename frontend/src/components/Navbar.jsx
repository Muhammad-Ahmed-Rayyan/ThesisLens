import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-subtle bg-page-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
        <Link
          to="/"
          className="font-display text-2xl font-semibold tracking-tight text-text-primary"
        >
          ThesisLens
        </Link>

        <button
          type="button"
          onClick={() => navigate('/research')}
          className="rounded-lg border border-accent-amber px-4 py-2 text-sm font-semibold text-accent-amber transition-colors hover:bg-accent-amber hover:text-page-bg"
        >
          Launch Research
        </button>
      </div>
    </header>
  );
}
