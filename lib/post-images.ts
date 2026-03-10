import type { PostFrontmatter } from "@/lib/posts";

const SITE_ORIGIN = "https://tangle.tools";

const FRONTMATTER_IMAGE_KEYS = [
  "coverImage",
  "heroImage",
  "image",
  "thumbnail",
] as const;

export function isExternalImage(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function normalizeImagePath(src: string): string {
  if (isExternalImage(src)) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

export function resolveFrontmatterImage(frontmatter: PostFrontmatter): string | undefined {
  for (const key of FRONTMATTER_IMAGE_KEYS) {
    const value = frontmatter[key];
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      return toBlogAssetPath(trimmed);
    }
  }

  return undefined;
}

export function resolveFrontmatterImageAlt(frontmatter: PostFrontmatter): string | undefined {
  const alt = frontmatter.imageAlt?.trim();
  if (!alt) return undefined;
  return alt;
}

export function toBlogAssetPath(src: string): string {
  if (isExternalImage(src)) return src;
  return normalizeImagePath(src);
}

export function toAbsoluteImageUrl(
  src: string,
  siteOrigin: string = SITE_ORIGIN
): string {
  if (isExternalImage(src)) return src;
  return `${siteOrigin}${toBlogAssetPath(src)}`;
}

export function getPostSocialImage(frontmatter: PostFrontmatter, slug: string): string {
  const frontmatterImage = resolveFrontmatterImage(frontmatter);
  if (!frontmatterImage) {
    return `/blog/og/${slug}`;
  }

  return toBlogAssetPath(frontmatterImage);
}

export function getAbsolutePostSocialImage(
  frontmatter: PostFrontmatter,
  slug: string,
  siteOrigin: string = SITE_ORIGIN
): string {
  return toAbsoluteImageUrl(getPostSocialImage(frontmatter, slug), siteOrigin);
}
