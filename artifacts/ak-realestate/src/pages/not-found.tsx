import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center px-6">
        <p className="text-[10px] tracking-[0.3em] text-primary/70 uppercase mb-4">404</p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Page Not Found</h1>
        <div className="w-10 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent mx-auto mb-6" />
        <p className="text-sm text-muted-foreground/60 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-primary border border-primary/40 px-6 py-3 hover:bg-primary/10 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
