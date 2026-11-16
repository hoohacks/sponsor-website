import { clamp, ease, inOut } from "./scroll";

/* "Ways to get involved" as a triptych: the three photos fill the screen edge
   to edge, then pull apart into framed columns as the section scrolls. */

const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Where each part of the scene is, from 0 to 1, at pinned progress `p`. */
export function rolesScene(p: number) {
  return {
    split: r3(inOut(clamp((p - 0.05) / 0.5))),
    color: r3(clamp((p - 0.12) / 0.45)),
    head: r3(ease(clamp((p - 0.4) / 0.22))),
    text: [0, 1, 2].map((i) => r3(ease(clamp((p - 0.55 - i * 0.08) / 0.22)))),
  };
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * The clip-path that shows part of a photo layer (`box`): `from` at k = 0,
 * `to` at k = 1, in between as the photo pulls apart. Corners round as it goes.
 */
export function insetBetween(box: Rect, from: Rect, to: Rect, k: number) {
  const edges = (r: Rect) => [
    r.top - box.top,
    box.left + box.width - (r.left + r.width),
    box.top + box.height - (r.top + r.height),
    r.left - box.left,
  ];
  const a = edges(from);
  const b = edges(to);
  const px = (n: number) => `${Math.round(n * 10) / 10}px`;
  const [t, r, bt, l] = a.map((v, i) => v + (b[i] - v) * k);
  return `inset(${px(t)} ${px(r)} ${px(bt)} ${px(l)} round ${px(6 * k)})`;
}

/**
 * The layer a photo is drawn in: centered on its final frame (so the frame
 * shows the middle of the photo) and big enough to cover its whole third of
 * the screen at the start.
 */
export function layerAround(third: Rect, card: Rect): Rect {
  const cx = card.left + card.width / 2;
  const cy = card.top + card.height / 2;
  const halfW = Math.max(cx - third.left, third.left + third.width - cx, card.width / 2);
  const halfH = Math.max(cy - third.top, third.top + third.height - cy, card.height / 2);
  return { left: cx - halfW, top: cy - halfH, width: halfW * 2, height: halfH * 2 };
}

/**
 * How much to scale a photo (drawn to cover `box`) around its frame's center
 * at split `k`: 1 while it fills its third, shrinking until it exactly fills
 * the frame, and never so small that the part showing has a gap.
 */
export function photoScale(box: Rect, third: Rect, card: Rect, nat: { width: number; height: number }, k: number) {
  const cover = (r: Rect) => Math.max(r.width / nat.width, r.height / nat.height);
  const base = cover(box);
  const halfW = (nat.width * base) / 2;
  const halfH = (nat.height * base) / 2;
  const cx = card.left + card.width / 2;
  const cy = card.top + card.height / 2;
  const at = (a: number, b: number) => a + (b - a) * k;
  // The part showing right now, and how far it reaches from the frame's center.
  const left = at(third.left, card.left);
  const right = at(third.left + third.width, card.left + card.width);
  const top = at(third.top, card.top);
  const bottom = at(third.top + third.height, card.top + card.height);
  const needed = Math.max((cx - left) / halfW, (right - cx) / halfW, (cy - top) / halfH, (bottom - cy) / halfH);
  const end = cover(card) / base;
  return Math.max(needed, at(1, end));
}
