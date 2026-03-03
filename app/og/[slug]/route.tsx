import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { OgCard } from "@/lib/og-card";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let title = "Tangle Technical Editorial";
  let summary =
    "Technical deep-dives into decentralized infrastructure, blueprint architecture, and verifiable execution.";
  let eyebrow = "Tangle Blog";

  try {
    const post = getPostBySlug(slug);
    title = post.frontmatter.title;
    summary = post.frontmatter.summary;
    eyebrow = post.frontmatter.series ?? "Tangle Blog";
  } catch {
    // fallback defaults
  }

  return new ImageResponse(<OgCard eyebrow={eyebrow} summary={summary} title={title} />, {
    width: 1200,
    height: 630,
  });
}
