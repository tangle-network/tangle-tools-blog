import Link from "next/link";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Clock3, Calendar } from "lucide-react";
import { PostImage } from "@/components/post-image";
import { resolveFrontmatterImage, resolveFrontmatterImageAlt } from "@/lib/post-images";

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, readingTime } = post;
  const thumbnail = resolveFrontmatterImage(frontmatter);
  const thumbnailAlt = resolveFrontmatterImageAlt(frontmatter) ?? frontmatter.title;

  return (
    <Link href={`/${frontmatter.slug}`} className="group block h-full">
      <article className="surface-card flex h-full flex-col overflow-hidden rounded-2xl p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]">
        <div className="aspect-[16/9]">
          <PostImage
            alt={thumbnailAlt}
            imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
            label={frontmatter.series ?? "Tangle Editorial"}
            sizes="(min-width: 1024px) 430px, (min-width: 640px) 44vw, 92vw"
            src={thumbnail}
          />
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5 sm:pt-5">
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
        </div>
      </article>
    </Link>
  );
}
