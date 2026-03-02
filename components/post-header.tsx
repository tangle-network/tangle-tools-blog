import { formatDate } from "@/lib/utils";
import { Calendar, Clock, User } from "lucide-react";
import type { PostFrontmatter } from "@/lib/posts";

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
  readingTime: string;
}

export function PostHeader({ frontmatter, readingTime }: PostHeaderProps) {
  return (
    <header className="mb-10">
      {frontmatter.series && (
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand dark:bg-brand/20">
            {frontmatter.series}
          </span>
          {frontmatter.seriesOrder && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Day {frontmatter.seriesOrder} of 6
            </span>
          )}
        </div>
      )}
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-4xl">
        {frontmatter.title}
      </h1>
      <p className="mb-6 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
        {frontmatter.summary}
      </p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {frontmatter.author}
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">&middot;</span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formatDate(frontmatter.date)}
        </span>
        <span className="text-neutral-300 dark:text-neutral-700">&middot;</span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          {readingTime}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-8 border-b border-neutral-200 dark:border-neutral-800" />
    </header>
  );
}
