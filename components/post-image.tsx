/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Layers3 } from "lucide-react";
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
            "radial-gradient(circle at 14% 12%, color-mix(in srgb, var(--color-brand-glow) 34%, transparent), transparent 52%), radial-gradient(circle at 88% 0%, color-mix(in srgb, var(--color-brand) 25%, transparent), transparent 48%), linear-gradient(165deg, color-mix(in srgb, var(--bg-elevated) 70%, var(--color-brand-soft)), var(--bg-card))",
        }}
      />
      <div className="relative flex h-full items-end justify-between p-4">
        <span className="rounded-full border border-[color:var(--border-strong)]/70 bg-[color:var(--bg-card)]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)] backdrop-blur">
          {label}
        </span>
        <Layers3 className="h-5 w-5 text-[color:var(--color-brand-strong)]" />
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/14 via-transparent to-transparent" />
        </>
      ) : (
        <FallbackVisual label={label} />
      )}
    </div>
  );
}
