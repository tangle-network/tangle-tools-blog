import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const PRODUCT_LINKS = [
  { href: "https://tangle.tools", label: "tangle.tools" },
  { href: "https://docs.tangle.tools", label: "Documentation" },
  { href: "https://github.com/tangle-network", label: "GitHub" },
] as const;

const BLOG_LINKS = [
  { href: "/post", label: "All Posts" },
  { href: "/feed.xml", label: "RSS Feed" },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 border-t shell-divider bg-[color:var(--bg-elevated)]/66">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-14">
        <div>
          <BrandLogo className="mb-4" />
          <p className="max-w-md text-sm leading-relaxed text-[color:var(--text-muted)]">
            Engineering notes from the Tangle team: blueprint architecture, verifiable execution,
            restaking systems, and production design decisions.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Product
          </h2>
          <ul className="space-y-2.5 text-sm">
            {PRODUCT_LINKS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[color:var(--text-body)] transition-colors hover:text-[color:var(--color-brand-strong)]"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Blog
          </h2>
          <ul className="space-y-2.5 text-sm">
            {BLOG_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[color:var(--text-body)] transition-colors hover:text-[color:var(--color-brand-strong)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t shell-divider">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-[color:var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>&copy; {new Date().getFullYear()} Tangle Network. All rights reserved.</p>
          <p>Built for tangle.tools/post editorial publishing.</p>
        </div>
      </div>
    </footer>
  );
}
