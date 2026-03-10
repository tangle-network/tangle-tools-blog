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
    <div className="mt-12 border-t border-[color:var(--border-subtle)] pt-8">
      {series && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
          {series}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/blog/${prev.frontmatter.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-4 transition-all hover:border-[color:var(--border-strong)]"
          >
            <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)] transition-transform group-hover:-translate-x-0.5" />
            <div className="min-w-0">
              <p className="text-xs text-[color:var(--text-muted)]">Previous</p>
              <p className="mt-0.5 truncate text-sm font-medium text-[color:var(--text-strong)]">
                {prev.frontmatter.title}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/blog/${next.frontmatter.slug}`}
            className="group flex items-start justify-end gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-4 text-right transition-all hover:border-[color:var(--border-strong)]"
          >
            <div className="min-w-0">
              <p className="text-xs text-[color:var(--text-muted)]">Next</p>
              <p className="mt-0.5 truncate text-sm font-medium text-[color:var(--text-strong)]">
                {next.frontmatter.title}
              </p>
            </div>
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
