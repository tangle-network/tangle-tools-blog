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
      <span className="relative hidden h-[32px] w-[260px] dark:block sm:h-[38px] sm:w-[310px] lg:h-[42px] lg:w-[340px]">
        <Image
          src="/brand/tangle-logo-light.svg"
          alt="Tangle"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 310px, 260px"
          className="object-contain object-left"
        />
      </span>
      <span className="relative h-[32px] w-[260px] dark:hidden sm:h-[38px] sm:w-[310px] lg:h-[42px] lg:w-[340px]">
        <Image
          src="/brand/tangle-logo.svg"
          alt="Tangle"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 310px, 260px"
          className="object-contain object-left"
        />
      </span>
    </Link>
  );
}
