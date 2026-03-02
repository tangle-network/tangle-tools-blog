"use client";

import { useState, useRef } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlockWrapper({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const code = preRef.current?.querySelector("code")?.textContent ?? "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 opacity-0 transition-all hover:bg-neutral-200 hover:text-neutral-700 group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
