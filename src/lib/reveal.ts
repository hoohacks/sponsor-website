import { useEffect } from "react";

/** Reveals that start fully clipped can't be seen by the observer, so watch their parent. */
const CLIPPED = new Set(["grow", "wipe"]);

/**
 * Plays each `[data-reveal]` element's entrance once, when it scrolls into view.
 * The motion itself lives in CSS (global.css, "Scroll reveals"); this only
 * flips `data-shown` so the animation starts.
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])")];
    const show = (el: HTMLElement) => (el.dataset.shown = "");
    if (!("IntersectionObserver" in window)) {
      els.forEach(show);
      return;
    }

    const byTarget = new Map<Element, HTMLElement[]>();
    for (const el of els) {
      const target = CLIPPED.has(el.dataset.reveal ?? "") ? (el.parentElement ?? el) : el;
      byTarget.set(target, [...(byTarget.get(target) ?? []), el]);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          byTarget.get(e.target)?.forEach(show);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    byTarget.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, []);
}
