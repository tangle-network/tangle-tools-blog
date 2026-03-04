/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { toBlogAssetPath } from "@/lib/post-images";

type MdxImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
type MdxVideoProps = React.VideoHTMLAttributes<HTMLVideoElement>;
type MdxIframeProps = React.IframeHTMLAttributes<HTMLIFrameElement>;

export function MdxImage({ alt = "", className, title, src, ...props }: MdxImageProps) {
  const resolvedSrc =
    typeof src === "string" && !/^(data:|blob:|cid:)/i.test(src)
      ? toBlogAssetPath(src)
      : src;

  return (
    <figure className="mdx-media">
      <div className="mdx-media-frame">
        <img
          alt={alt}
          className={cn("h-auto w-full", className)}
          decoding="async"
          loading="lazy"
          {...props}
          src={resolvedSrc}
        />
      </div>
      {title && <figcaption className="mdx-media-caption">{title}</figcaption>}
    </figure>
  );
}

export function MdxVideo({ className, controls, title, ...props }: MdxVideoProps) {
  return (
    <figure className="mdx-media">
      <div className="mdx-media-frame">
        <video
          className={cn("h-auto w-full", className)}
          controls={controls ?? true}
          playsInline
          preload="metadata"
          {...props}
        />
      </div>
      {title && <figcaption className="mdx-media-caption">{title}</figcaption>}
    </figure>
  );
}

export function MdxIframe({
  allowFullScreen,
  className,
  title,
  ...props
}: MdxIframeProps) {
  return (
    <figure className="mdx-media">
      <div className="mdx-media-frame">
        <div className="mdx-embed">
          <iframe
            allowFullScreen={allowFullScreen ?? true}
            className={cn("h-full w-full", className)}
            loading="lazy"
            title={title ?? "Embedded content"}
            {...props}
          />
        </div>
      </div>
      {title && <figcaption className="mdx-media-caption">{title}</figcaption>}
    </figure>
  );
}
