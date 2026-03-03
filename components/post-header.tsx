import { formatDate } from "@/lib/utils";
import { Calendar, Clock3, User } from "lucide-react";
import type { PostFrontmatter } from "@/lib/posts";
import { PostImage } from "@/components/post-image";
import { resolveFrontmatterImage, resolveFrontmatterImageAlt } from "@/lib/post-images";

interface PostHeaderProps {
  frontmatter: PostFrontmatter;
  readingTime: string;
}

export function PostHeader({ frontmatter, readingTime }: PostHeaderProps) {
  const heroImage = resolveFrontmatterImage(frontmatter);
  const heroAlt = resolveFrontmatterImageAlt(frontmatter) ?? frontmatter.title;

  return (
    <header className="mb-12 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
      {frontmatter.series && (
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-full border border-[color:var(--color-brand)]/30 bg-[color:var(--color-brand-soft)] px-3 py-1 text-xs font-semibold tracking-wide text-[color:var(--color-brand-strong)]">
            {frontmatter.series}
          </span>
          {frontmatter.seriesOrder && (
            <span className="text-sm text-[color:var(--text-muted)]">Day {frontmatter.seriesOrder} of 6</span>
          )}
        </div>
      )}

      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-[2.55rem]">
        {frontmatter.title}
      </h1>

      <p className="mb-6 max-w-3xl text-lg leading-relaxed text-[color:var(--text-body)]">
        {frontmatter.summary}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--text-muted)]">
        <span className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          {frontmatter.author}
        </span>
        <span aria-hidden className="text-[color:var(--border-strong)]">
          •
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formatDate(frontmatter.date)}
        </span>
        <span aria-hidden className="text-[color:var(--border-strong)]">
          •
        </span>
        <span className="flex items-center gap-1.5">
          <Clock3 className="h-4 w-4" />
          {readingTime}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {frontmatter.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]/45 px-2.5 py-1 text-xs font-medium text-[color:var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {heroImage && (
        <div className="mt-7">
          <div className="aspect-[16/9] sm:aspect-[2/1]">
            <PostImage
              alt={heroAlt}
              className="rounded-xl"
              priority
              sizes="(min-width: 1024px) 860px, 100vw"
              src={heroImage}
            />
          </div>
        </div>
      )}
    </header>
  );
}
