import Link from "next/link";

type AnchorProps = React.ComponentPropsWithoutRef<"a">;

function normalizeHref(rawHref: string): string {
  if (rawHref.startsWith("/blog/")) {
    return `/blog/${rawHref.slice(6)}`;
  }
  return rawHref;
}

export function MdxLink({ href = "", rel, className, children, ...rest }: AnchorProps) {
  if (!href) {
    return (
      <a className={className} rel={rel} {...rest}>
        {children}
      </a>
    );
  }

  const normalizedHref = normalizeHref(href);
  const isAnchor = className?.toString().includes("anchor") || normalizedHref.startsWith("#");
  if (isAnchor) {
    return (
      <a href={normalizedHref} className={className} rel={rel} {...rest}>
        {children}
      </a>
    );
  }

  if (normalizedHref.startsWith("/")) {
    return (
      <Link href={normalizedHref} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  const safeRel = rel ?? "noopener noreferrer";
  return (
    <a href={normalizedHref} className={className} rel={safeRel} target="_blank" {...rest}>
      {children}
    </a>
  );
}
