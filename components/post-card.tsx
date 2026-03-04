import Image from "next/image";
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
    <Link href={`/post/${frontmatter.slug}`} className="group block h-full">
      <article className="surface-card flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-lift)]">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <PostImage
            alt={thumbnailAlt}
            imageClassName="transition-transform duration-500 group-hover:scale-[1.04]"
            label={frontmatter.series ?? "Tangle Blog"}
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 46vw, 92vw"
            src={thumbnail}
          />
          <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-3">
            <span className="rounded-full border border-white/28 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
              {frontmatter.series ?? "Tangle Blog"}
            </span>
            <span className="relative h-7 w-7 overflow-hidden rounded-full border border-white/30 bg-white/10 shadow-[0_8px_16px_-10px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              <Image src="/post/brand/tangle-icon-filled.svg" alt="" fill sizes="28px" className="object-cover" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-5 sm:px-5">
          {frontmatter.seriesOrder && (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-[color:var(--text-muted)]">
              Day {frontmatter.seriesOrder}
            </p>
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

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-3.5">
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]/60 px-2 py-0.5 text-[11px] text-[color:var(--text-muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--color-brand-strong)]">
              Read post
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
