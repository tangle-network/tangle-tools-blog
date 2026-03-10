import { permanentRedirect } from "next/navigation";

interface LegacyPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LegacySlugRedirectPage({ params }: LegacyPageProps) {
  const { slug } = await params;
  permanentRedirect(`/blog/${slug}`);
}
