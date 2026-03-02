import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, readingTime } = post;

  return (
    <Link href={`/${frontmatter.slug}`} className="group block">
      <article className="rounded-xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900/50 dark:hover:border-neutral-700 dark:hover:shadow-neutral-900/50">
        {frontmatter.series && (
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand dark:bg-brand/20">
              {frontmatter.series}
            </span>
            {frontmatter.seriesOrder && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                Day {frontmatter.seriesOrder}
              </span>
            )}
          </div>
        )}
        <h2 className="mb-2 text-lg font-semibold tracking-tight text-neutral-900 transition-colors group-hover:text-brand dark:text-neutral-100">
          {frontmatter.title}
        </h2>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {frontmatter.summary}
        </p>
        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(frontmatter.date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
