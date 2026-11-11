export const formatPrice = (dollars: number) => `$${dollars.toLocaleString("en-US")}`;

/** Compact price for tight spaces: $15,000 becomes $15K. Odd amounts stay exact. */
export const formatPriceShort = (dollars: number) =>
  dollars >= 1000 && dollars % 500 === 0 ? `$${dollars / 1000}K` : formatPrice(dollars);

/**
 * Size a logo so every logo covers about the same visual area, whatever its
 * shape. Equal heights make wide wordmarks look huge and square marks tiny.
 */
export function logoSize(ratio: number, { area, maxH, maxW }: { area: number; maxH: number; maxW: number }) {
  let h = Math.sqrt(area / ratio);
  let w = h * ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  if (w > maxW) {
    w = maxW;
    h = w / ratio;
  }
  return { w: Math.round(w), h: Math.round(h) };
}
