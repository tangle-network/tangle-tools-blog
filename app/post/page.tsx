import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function PostIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-6 py-7 shadow-[var(--shadow-soft)] sm:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
            Archive
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text-strong)] sm:text-[2.4rem]">
            All Tangle blog posts
          </h1>
          <p className="mt-3 max-w-2xl text-base text-[color:var(--text-body)]">
            Full post archive, sorted by most recent publication.
          </p>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
