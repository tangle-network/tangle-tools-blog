import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./brand-logo";

const INTERNAL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/post", label: "All Posts" },
] as const;

const EXTERNAL_LINKS = [
  { href: "https://tangle.tools", label: "tangle.tools" },
  { href: "https://docs.tangle.tools", label: "Docs" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b shell-divider bg-[color:var(--bg-canvas)]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandLogo className="min-w-0" />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {INTERNAL_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-strong)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/post"
            className="inline-flex rounded-lg px-2.5 py-2 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-strong)] md:hidden"
          >
            Posts
          </Link>
          {EXTERNAL_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg px-2.5 py-2 text-sm font-medium text-[color:var(--text-muted)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-strong)] lg:inline-flex"
            >
              {item.label}
              <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </a>
          ))}
          <a
            href="https://github.com/tangle-network"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-strong)]"
            aria-label="Tangle on GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
