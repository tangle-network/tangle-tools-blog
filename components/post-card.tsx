import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Clock3, Calendar } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, readingTime } = post;

  return (
    <Link href={`/${frontmatter.slug}`} className="group block h-full">
      <article className="surface-card h-full rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]">
        {frontmatter.series && (
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-[color:var(--color-brand)]/25 bg-[color:var(--color-brand-soft)] px-2.5 py-0.5 text-xs font-semibold tracking-wide text-[color:var(--color-brand-strong)]">
              {frontmatter.series}
            </span>
            {frontmatter.seriesOrder && (
              <span className="text-xs text-[color:var(--text-muted)]">
                Day {frontmatter.seriesOrder}
              </span>
            )}
          </div>
        )}

        <h2 className="mb-2 text-xl font-semibold tracking-tight text-[color:var(--text-strong)] transition-colors group-hover:text-[color:var(--color-brand-strong)]">
          {frontmatter.title}
        </h2>

        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-[color:var(--text-body)]">
          {frontmatter.summary}
        </p>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(frontmatter.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" />
            {readingTime}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {frontmatter.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]/50 px-2 py-0.5 text-[11px] text-[color:var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-brand-strong)]">
            Read
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}
