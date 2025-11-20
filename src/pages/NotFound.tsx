import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center rounded-2xl border border-brand-soft-border bg-brand-soft px-6 py-8 shadow-sm max-w-md">
        <h1 className="mb-2 text-5xl font-black text-brand">404</h1>
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-soft-foreground">
          Page not found
        </p>
        <p className="mb-6 text-sm text-[#4B5563]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand/90"
        >
          Go back to menu
        </a>
      </div>
    </div>
  );
};

export default NotFound;
