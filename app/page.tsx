import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { formatDate } from "@/lib/utils";

export default function BlogIndex() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 3);
  const mobileOverflow = posts.slice(3, 8);
  const latestDate = posts[0]?.frontmatter.date;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section
        className="mb-12 overflow-hidden rounded-3xl border border-[color:var(--border-subtle)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8 sm:py-10"
        style={{
          background:
            "radial-gradient(1200px 380px at 95% -10%, color-mix(in srgb, var(--color-brand) 24%, transparent), transparent 60%), radial-gradient(740px 320px at -12% 105%, color-mix(in srgb, var(--color-brand-cool) 24%, transparent), transparent 60%), linear-gradient(155deg, color-mix(in srgb, var(--bg-card) 92%, transparent), color-mix(in srgb, var(--bg-elevated) 92%, transparent))",
        }}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-brand)]/30 bg-[color:var(--color-brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-brand-strong)]">
              Tangle Blog
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-[2.75rem]">
              Ship infrastructure that can be verified, priced, and operated at scale.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[color:var(--text-body)] sm:text-lg">
              Posts on decentralized infrastructure design, blueprint architecture, trusted
              execution environments, and production lessons from the Tangle ecosystem.
            </p>
          </div>

          <div className="surface-subtle rounded-2xl p-4 sm:p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
              Snapshot
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[color:var(--text-muted)]">Published posts</dt>
                <dd className="mt-1 text-xl font-semibold text-[color:var(--text-strong)]">{posts.length}</dd>
              </div>
              <div>
                <dt className="text-[color:var(--text-muted)]">Latest update</dt>
                <dd className="mt-1 text-sm font-medium text-[color:var(--text-strong)]">
                  {latestDate ? formatDate(latestDate) : "-"}
                </dd>
              </div>
            </dl>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-brand-strong)] transition-colors hover:text-[color:var(--color-brand)]"
            >
              Browse full archive
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text-strong)]">
            Latest posts
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-3 py-2 text-sm font-medium text-[color:var(--text-body)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-strong)]"
          >
            View all {posts.length}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post) => (
            <PostCard key={post.frontmatter.slug} post={post} />
          ))}
        </div>

        {mobileOverflow.length > 0 && (
          <div className="mt-8 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] p-4 lg:hidden">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
              More recent posts
            </h3>
            <ul className="space-y-2.5">
              {mobileOverflow.map((post) => (
                <li key={post.frontmatter.slug}>
                  <Link
                    href={`/blog/${post.frontmatter.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-[color:var(--text-body)] transition-colors hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-strong)]"
                  >
                    <span className="line-clamp-1">{post.frontmatter.title}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[color:var(--text-muted)]">
                      <Clock3 className="h-3 w-3" />
                      {post.readingTime}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
