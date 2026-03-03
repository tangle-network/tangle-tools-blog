interface OgCardProps {
  eyebrow?: string;
  title: string;
  summary?: string;
}

export function OgCard({ eyebrow, title, summary }: OgCardProps) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
        background:
          "radial-gradient(circle at -10% -10%, rgba(17, 150, 230, 0.35), transparent 48%), radial-gradient(circle at 110% 0%, rgba(15, 98, 254, 0.28), transparent 45%), #040a14",
        color: "#eaf3ff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {eyebrow && (
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              border: "1px solid rgba(112, 194, 255, 0.35)",
              borderRadius: "999px",
              background: "rgba(24, 44, 68, 0.9)",
              color: "#7ac7ff",
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
            lineHeight: 1.1,
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
              maxWidth: "1020px",
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#acc3e0",
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
          stroke="#49b8ff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span style={{ fontSize: "24px", fontWeight: 600, color: "#dbe8f8" }}>
          tangle.tools/blog
        </span>
      </div>
    </div>
  );
}
