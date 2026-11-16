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
