"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -78% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <div className="mb-6 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="surface-subtle flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-[color:var(--text-body)]"
        >
          <List className="h-4 w-4" />
          On this page
          <svg
            className={cn("ml-auto h-4 w-4 transition-transform", isOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <nav className="surface-subtle mt-2 rounded-lg p-4">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-sm transition-colors hover:text-[color:var(--color-brand)]",
                      heading.level === 3 && "pl-4",
                      heading.level === 4 && "pl-6",
                      activeId === heading.id
                        ? "font-medium text-[color:var(--color-brand-strong)]"
                        : "text-[color:var(--text-muted)]"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-4 shadow-[var(--shadow-soft)]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
            On this page
          </p>
          <nav>
            <ul className="space-y-1.5 border-l border-[color:var(--border-subtle)]">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={cn(
                      "toc-link -ml-px block border-l-2 py-1 text-[13px] leading-snug transition-all",
                      heading.level === 3 ? "pl-5" : "pl-4",
                      heading.level === 4 ? "pl-7" : "",
                      activeId === heading.id
                        ? "active border-[color:var(--color-brand)] text-[color:var(--color-brand-strong)]"
                        : "border-transparent text-[color:var(--text-muted)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-strong)]"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
