import { useRef } from "react";
import { ease, enterProgress, useScrollFrame } from "./scroll";

/** A heading (or any block) that rises in as it scrolls into view. Attach the ref. */
export function useRise<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useScrollFrame(() => {
    const el = ref.current;
    if (!el) return;
    const o = ease(enterProgress(el.getBoundingClientRect(), innerHeight, 0.35));
    el.style.opacity = String(o);
    el.style.transform = `translateY(${(1 - o) * 40}px)`;
  });
  return ref;
}
