import type { ImgHTMLAttributes } from "react";
import type { Photo as PhotoName } from "../content";

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> {
  name: PhotoName;
  alt: string;
  /** How wide the image renders, for the browser to pick a size. */
  sizes: string;
}

/** Event photo with a responsive WebP source set (800w and 1600w). */
export function Photo({ name, alt, sizes, loading = "lazy", ...rest }: Props) {
  return (
    <img
      src={`/img/${name}-800.webp`}
      srcSet={`/img/${name}-800.webp 800w, /img/${name}-1600.webp 1600w`}
      sizes={sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      {...rest}
    />
  );
}
