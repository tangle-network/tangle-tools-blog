import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tangle Blog",
    template: "%s | Tangle Blog",
  },
  description:
    "Technical deep-dives into Tangle Network: decentralized infrastructure, blueprints, TEE, verification, and building on-chain services.",
  keywords: [
    "Tangle",
    "decentralized infrastructure",
    "restaking",
    "MPC",
    "TEE",
    "blueprints",
  ],
  metadataBase: new URL("https://tangle.tools"),
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/blog",
    siteName: "Tangle Blog",
    title: "Tangle Blog",
    description:
      "Technical deep-dives into decentralized infrastructure, blueprints, TEE, verification, and building on-chain services.",
    images: [
      {
        url: "/blog/og",
        width: 1200,
        height: 630,
        alt: "Tangle Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tangle Blog",
    description:
      "Technical deep-dives into decentralized infrastructure, blueprints, TEE, verification, and building on-chain services.",
    images: ["/blog/og"],
    creator: "@tabordrewstone",
    site: "@tangle_network",
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
