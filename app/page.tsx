import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
          Technical deep-dives into decentralized infrastructure, blueprints, TEE,
          verification, and building on-chain services.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
