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
      { rootMargin: "-80px 0px -80% 0px" }
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
      {/* Mobile TOC */}
      <div className="mb-6 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
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
          <nav className="mt-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block text-sm transition-colors hover:text-brand",
                      heading.level === 3 && "pl-4",
                      activeId === heading.id
                        ? "font-medium text-brand"
                        : "text-neutral-600 dark:text-neutral-400"
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

      {/* Desktop TOC - sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            On this page
          </p>
          <nav>
            <ul className="space-y-1.5 border-l border-neutral-200 dark:border-neutral-800">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    className={cn(
                      "toc-link -ml-px block border-l-2 py-1 text-[13px] leading-snug transition-all",
                      heading.level === 3 ? "pl-6" : "pl-4",
                      activeId === heading.id
                        ? "active border-brand text-brand font-medium"
                        : "border-transparent text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-300"
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
