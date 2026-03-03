"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://tangle.tools/post/${slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-9 items-center gap-1.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-3 text-xs text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-strong)]"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Share
      </a>
      <button
        onClick={copyLink}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--bg-card)] px-3 text-xs text-[color:var(--text-muted)] transition-colors hover:text-[color:var(--text-strong)]"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
