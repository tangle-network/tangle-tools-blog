import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showBlogLabel?: boolean;
}

export function BrandLogo({
  href = "/",
  className,
  iconClassName,
  textClassName,
  showBlogLabel = true,
}: BrandLogoProps) {
  const content = (
    <>
      <span
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[color:var(--border-strong)] bg-[color:var(--bg-card)] shadow-[var(--shadow-soft)]",
          iconClassName
        )}
      >
        <Image src="/brand/tangle-icon-filled.svg" alt="" fill sizes="36px" className="object-cover" />
      </span>
      <span className={cn("flex min-w-0 flex-col", textClassName)}>
        <span className="relative hidden h-[18px] w-[150px] dark:block sm:h-[20px] sm:w-[166px]">
          <Image src="/brand/tangle-logo-light.svg" alt="" fill sizes="166px" className="object-contain object-left" />
        </span>
        <span className="relative h-[18px] w-[150px] dark:hidden sm:h-[20px] sm:w-[166px]">
          <Image src="/brand/tangle-logo.svg" alt="" fill sizes="166px" className="object-contain object-left" />
        </span>
        {showBlogLabel && (
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-muted)] sm:text-[0.66rem]">
            Technical editorial
          </span>
        )}
      </span>
    </>
  );

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-xl transition-colors",
        className
      )}
      aria-label="Go to Tangle blog home"
    >
      {content}
    </Link>
  );
}
