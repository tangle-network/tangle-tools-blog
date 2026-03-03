/* eslint-disable @next/next/no-img-element */
interface OgCardProps {
  eyebrow?: string;
  title: string;
  summary?: string;
  imageUrl?: string;
}

export function OgCard({ eyebrow, title, summary, imageUrl }: OgCardProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        background:
          "radial-gradient(circle at -10% -15%, rgba(175, 120, 255, 0.34), transparent 46%), radial-gradient(circle at 108% -8%, rgba(128, 62, 233, 0.4), transparent 42%), #090510",
        color: "#f4efff",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: imageUrl ? "66%" : "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {eyebrow && (
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                border: "1px solid rgba(198, 163, 255, 0.42)",
                borderRadius: "999px",
                background: "rgba(32, 18, 56, 0.8)",
                color: "#dbc3ff",
                padding: "8px 14px",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          )}

          <h1
            style={{
              margin: 0,
              fontSize: "56px",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              fontWeight: 700,
            }}
          >
            {title}
          </h1>

          {summary && (
            <p
              style={{
                margin: 0,
                maxWidth: imageUrl ? "740px" : "1020px",
                fontSize: "26px",
                lineHeight: 1.35,
                color: "#c5b4e8",
              }}
            >
              {summary}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bc8aff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span style={{ fontSize: "24px", fontWeight: 600, color: "#efe7ff" }}>
            tangle.tools/blog
          </span>
        </div>
      </div>

      {imageUrl && (
        <div
          style={{
            width: "34%",
            height: "100%",
            position: "relative",
            display: "flex",
            borderLeft: "1px solid rgba(198, 163, 255, 0.26)",
          }}
        >
          <img
            src={imageUrl}
            alt=""
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(9, 5, 16, 0.04), rgba(9, 5, 16, 0.48))",
            }}
          />
        </div>
      )}
    </div>
  );
}
