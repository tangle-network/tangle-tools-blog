import { ImageResponse } from "next/og";
import { OgCard } from "@/lib/og-card";

export async function GET() {
  return new ImageResponse(
    <OgCard
      eyebrow="Tangle Network"
      summary="Technical deep-dives into decentralized infrastructure, blueprint architecture, and verifiable execution."
      title="Tangle Technical Editorial"
    />,
    {
      width: 1200,
      height: 630,
    }
  );
}
