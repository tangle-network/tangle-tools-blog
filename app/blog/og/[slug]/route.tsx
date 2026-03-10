import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";
import { OgCard } from "@/lib/og-card";
import { resolveFrontmatterImage, toAbsoluteImageUrl } from "@/lib/post-images";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let title = "Tangle Blog";
  let summary =
    "Technical deep-dives into decentralized infrastructure, blueprint architecture, and verifiable execution.";
  let eyebrow = "Tangle Blog";
  let imageUrl: string | undefined;

  try {
    const post = getPostBySlug(slug);
    title = post.frontmatter.title;
    summary = post.frontmatter.summary;
    eyebrow = post.frontmatter.series ?? "Tangle Blog";
    const frontmatterImage = resolveFrontmatterImage(post.frontmatter);
    if (frontmatterImage) {
      imageUrl = toAbsoluteImageUrl(frontmatterImage);
    }
  } catch {
    // fallback defaults
  }

  return new ImageResponse(
    <OgCard eyebrow={eyebrow} imageUrl={imageUrl} summary={summary} title={title} />,
    {
      width: 1200,
      height: 630,
    }
  );
}
