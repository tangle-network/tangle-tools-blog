/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isExternalImage } from "@/lib/post-images";

interface PostImageProps {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  label?: string;
}

function FallbackVisual({ label }: { label: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[inherit] border border-[color:var(--media-frame-border)] bg-[color:var(--media-frame-bg)]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 10%, color-mix(in srgb, var(--color-brand) 32%, transparent), transparent 54%), radial-gradient(circle at 94% 2%, color-mix(in srgb, var(--color-brand-cool) 28%, transparent), transparent 46%), linear-gradient(165deg, color-mix(in srgb, var(--bg-elevated) 72%, var(--color-brand-soft)), var(--bg-card))",
        }}
      />
      <div className="relative flex h-full items-end justify-between p-4">
        <span className="rounded-full border border-[color:var(--border-strong)]/70 bg-[color:var(--bg-card)]/86 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)] backdrop-blur">
          {label}
        </span>
        <span className="relative h-7 w-7 overflow-hidden rounded-full border border-[color:var(--border-strong)]/80 bg-[color:var(--bg-card)]/80">
          <Image src="/brand/tangle-icon-filled.svg" alt="" fill sizes="28px" className="object-cover" />
        </span>
      </div>
    </div>
  );
}

export function PostImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  imageClassName,
  label = "Tangle Editorial",
}: PostImageProps) {
  return (
    <div className={cn("relative isolate h-full w-full overflow-hidden rounded-xl", className)}>
      {src ? (
        <>
          {isExternalImage(src) ? (
            <img
              src={src}
              alt={alt}
              className={cn("h-full w-full object-cover", imageClassName)}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              loading={priority ? "eager" : "lazy"}
              sizes={sizes}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              className={cn("object-cover", imageClassName)}
              priority={priority}
              sizes={sizes}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/18 via-black/0 to-transparent" />
        </>
      ) : (
        <FallbackVisual label={label} />
      )}
    </div>
  );
}
