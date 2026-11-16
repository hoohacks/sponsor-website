import type { Photo as PhotoName } from "../content";
import { Photo } from "./Photo";

interface Props {
  name: PhotoName;
  alt: string;
  sizes: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Called when the color photo has loaded. */
  onLoad?: () => void;
}

/**
 * A photo that can come into color: the color image under a grayscale copy.
 * The parent sets `--color` (0 = black and white, 1 = full color); with no
 * variable set it shows in color. Only the copy's opacity changes, so it's cheap.
 */
export function DuoPhoto({ name, alt, sizes, className, loading = "lazy", onLoad }: Props) {
  return (
    <div className={className ? `duo ${className}` : "duo"}>
      <Photo name={name} alt={alt} sizes={sizes} loading={loading} onLoad={onLoad} />
      <Photo name={name} alt="" sizes={sizes} loading={loading} className="duo__bw" aria-hidden="true" />
    </div>
  );
}
