import { useEffect, useRef, useState } from "react";

/* Scroll-driven motion. Progress math is pure; one shared animation frame runs
   every subscriber after a scroll or resize. Subscribers should only write
   transform, opacity, clip-path or the --color variable. */

export const REDUCED = "(prefers-reduced-motion: reduce)";
export const PHONE = "(max-width: 760px)";

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const ease = (t: number) => 1 - Math.pow(1 - t, 3);
export const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Box = { top: number; height: number };

/** A pinned (sticky) section: 0 as it pins, 1 as it lets go. */
export const pinProgress = (r: Box, vh: number) => clamp(-r.top / Math.max(1, r.height - vh));

/** 0 as the top reaches the bottom of the screen, 1 once the top is `end` of the way up. */
export const enterProgress = (r: { top: number }, vh: number, end = 0.5) => clamp((vh - r.top) / (vh * (1 - end)));

/** 0 as it enters at the bottom, 1 as it leaves at the top. */
export const throughProgress = (r: Box, vh: number) => clamp((vh - r.top) / (vh + r.height));

const subscribers = new Set<() => void>();
let frame = 0;
const run = () => {
  frame = 0;
  subscribers.forEach((cb) => cb());
};
const schedule = () => {
  if (!frame) frame = requestAnimationFrame(run);
};

/** Calls `cb` once per frame after the page scrolls or resizes. Never under reduced motion. */
export function useScrollFrame(cb: () => void) {
  const latest = useRef(cb);
  latest.current = cb;
  useEffect(() => {
    if (window.matchMedia(REDUCED).matches) return;
    const sub = () => latest.current();
    if (subscribers.size === 0) {
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
      addEventListener("load", schedule);
    }
    subscribers.add(sub);
    schedule();
    return () => {
      subscribers.delete(sub);
      if (subscribers.size === 0) {
        removeEventListener("scroll", schedule);
        removeEventListener("resize", schedule);
        removeEventListener("load", schedule);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
  }, []);
}

/** Whether a media query matches, kept up to date. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** Scrolls to a point `p` (0 to 1) of the way through a pinned section. */
export function scrollToPin(el: HTMLElement, p: number) {
  const top = el.getBoundingClientRect().top + scrollY;
  scrollTo({ top: top + p * (el.offsetHeight - innerHeight), behavior: "smooth" });
}

/**
 * How far a sideways rail travels: until its last item reaches where the
 * first item started. `starts` are each item's left edge at rest, in pixels.
 */
export const railDistance = (starts: number[], origin: number) => Math.max(0, starts[starts.length - 1] - origin);
