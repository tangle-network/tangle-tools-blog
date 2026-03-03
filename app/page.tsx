import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
      <section className="mb-10 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-brand)]/35 bg-[color:var(--color-brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--color-brand-strong)]">
          Tangle Network
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-[2.55rem]">
          Technical Editorial
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-[color:var(--text-body)]">
          Systems notes on decentralized infrastructure, blueprint architecture, verifiable execution,
          and production-grade service design on Tangle.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
