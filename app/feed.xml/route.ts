import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = "https://tangle.tools/blog";

  const feed = new Feed({
    title: "Tangle Blog",
    description:
      "Technical deep-dives into Tangle Network: decentralized infrastructure, blueprints, TEE, verification, and building on-chain services.",
    id: siteUrl,
    link: siteUrl,
    language: "en",
    copyright: `All rights reserved ${new Date().getFullYear()}, Tangle Network`,
    author: {
      name: "Drew Stone",
      link: "https://tangle.tools",
    },
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.frontmatter.title,
      id: `${siteUrl}/${post.frontmatter.slug}`,
      link: `${siteUrl}/${post.frontmatter.slug}`,
      description: post.frontmatter.summary,
      date: new Date(post.frontmatter.date),
      author: [{ name: post.frontmatter.author }],
    });
  });

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
