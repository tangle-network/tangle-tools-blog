import Link from "next/link";
import type { Post } from "@/lib/posts";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PostFooterProps {
  prev: Post | null;
  next: Post | null;
  series?: string;
}

export function PostFooter({ prev, next, series }: PostFooterProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-12 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      {series && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {series}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/${prev.frontmatter.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
          >
            <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:-translate-x-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Previous</p>
              <p className="mt-0.5 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {prev.frontmatter.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/${next.frontmatter.slug}`}
            className="group flex items-start justify-end gap-3 rounded-xl border border-neutral-200 p-4 text-right transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
          >
            <div className="min-w-0">
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Next</p>
              <p className="mt-0.5 truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {next.frontmatter.title}
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
