import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  href = "/post",
  className,
  priority = false,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center rounded-xl transition-colors",
        className
      )}
      aria-label="Go to Tangle blog home"
    >
      <span className="relative hidden h-[26px] w-[220px] dark:block sm:h-[30px] sm:w-[252px] lg:h-[34px] lg:w-[286px]">
        <Image
          src="/post/brand/tangle-logo-light.svg"
          alt="Tangle"
          fill
          priority={priority}
          sizes="(min-width: 640px) 182px, 168px"
          className="object-contain object-left"
        />
      </span>
      <span className="relative h-[26px] w-[220px] dark:hidden sm:h-[30px] sm:w-[252px] lg:h-[34px] lg:w-[286px]">
        <Image
          src="/post/brand/tangle-logo.svg"
          alt="Tangle"
          fill
          priority={priority}
          sizes="(min-width: 640px) 182px, 168px"
          className="object-contain object-left"
        />
      </span>
    </Link>
  );
}
