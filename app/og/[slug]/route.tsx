import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let title = "Tangle Blog";
  let summary = "";
  let series = "";

  try {
    const post = getPostBySlug(slug);
    title = post.frontmatter.title;
    summary = post.frontmatter.summary;
    series = post.frontmatter.series ?? "";
  } catch {
    // fallback to defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {series && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                color: "#7C3AED",
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {series}
            </span>
          </div>
        )}
        <h1
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {summary && (
          <p
            style={{
              fontSize: "24px",
              color: "#a0a0a0",
              lineHeight: 1.4,
              marginTop: "20px",
            }}
          >
            {summary}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: "40px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span
            style={{
              color: "#e0e0e0",
              fontSize: "22px",
              fontWeight: 600,
              marginLeft: "12px",
            }}
          >
            tangle.tools/blog
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
