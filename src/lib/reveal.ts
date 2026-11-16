import { clamp, ease, enterProgress, useScrollFrame } from "./scroll";

export type From = "up" | "left" | "right";

interface At {
  /** The block's top edge, from the top of the screen. */
  top: number;
  vh: number;
  from?: From;
  /** Position in a group: later items arrive a little later. */
  index?: number;
  /** Where on screen (fraction from the top) its top must reach to be fully in. */
  end?: number;
}

/** Where a block sits as it scrolls into view: faded and offset, then settled. */
export function revealAt({ top, vh, from = "up", index = 0, end = 0.65 }: At) {
  const p = ease(clamp(enterProgress({ top }, vh, end) * 1.25 - index * 0.12));
  const off = 1 - p;
  const r = (n: number) => Math.round(n * 1000) / 1000 || 0;
  return {
    opacity: r(p),
    x: r(from === "right" ? off * 80 : from === "left" ? -off * 80 : 0),
    y: r(from === "up" ? off * 40 : 0),
  };
}

/**
 * Drives every `[data-rise]` block on the page with the scroll: it fades and
 * slides in as it arrives, and back out if you scroll up. `data-rise` names the
 * direction ("up", "left", "right"); `data-i` staggers a group; `data-end`
 * sets where it finishes. Nothing is hidden by CSS, so if this never runs
 * (reduced motion) every block simply shows.
 */
export function useReveals() {
  useScrollFrame(() => {
    const vh = innerHeight;
    const els = document.querySelectorAll<HTMLElement>("[data-rise]");
    // Read every position first, then write, so the browser lays out once.
    const tops = Array.from(els, (el) => el.getBoundingClientRect().top);
    els.forEach((el, k) => {
      const { opacity, x, y } = revealAt({
        top: tops[k],
        vh,
        from: (el.dataset.rise || "up") as From,
        index: Number(el.dataset.i ?? 0),
        end: el.dataset.end ? Number(el.dataset.end) : undefined,
      });
      el.style.opacity = String(opacity);
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}
