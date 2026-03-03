import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 text-center">
      <h1 className="mb-4 text-6xl font-semibold tracking-tight text-[color:var(--text-strong)]">404</h1>
      <p className="mb-8 text-lg text-[color:var(--text-muted)]">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[color:var(--color-brand-strong)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[color:var(--color-brand)]"
      >
        Back to blog
      </Link>
    </div>
  );
}
