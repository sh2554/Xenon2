import { Link } from "react-router-dom";
import { Home, Code } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="xenon-shell flex min-h-screen flex-col items-center justify-center px-4">
      <div className="xenon-panel mx-auto w-full max-w-lg p-12 text-center">
        <div className="relative mx-auto mb-6 h-24 w-24">
          <div className="absolute inset-0 rounded-3xl bg-[var(--danger)]/10 rotate-6" />
          <div className="absolute inset-0 rounded-3xl bg-[var(--accent-soft)] -rotate-3 flex items-center justify-center">
            <Code className="h-10 w-10 text-[var(--accent)]" />
          </div>
        </div>
        <h1 className="text-6xl font-black tracking-tight">404</h1>
        <p className="mt-2 text-xl font-bold">Page not found</p>
        <p className="mt-3 text-sm text-[var(--muted)] max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="xenon-btn inline-flex items-center gap-2 mt-8 px-8 py-3"
        >
          <Home className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
