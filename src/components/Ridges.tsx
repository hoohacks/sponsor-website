import { useEffect, useRef, useState } from "react";
import { ridgeLines, toPath } from "../lib/ridges";
import { clamp, enterProgress, pinProgress, throughProgress, useScrollFrame } from "../lib/scroll";

interface Props {
  seed: number;
  layers: number;
  /** "x": drifts sideways through a pinned section. "y": drifts as the section scrolls past. */
  drift: "x" | "y";
  className?: string;
}

/**
 * Faint Blue Ridge ridgelines behind a section. Sized to its own box, redrawn
 * on resize, and moved as one layer so the lines never cross.
 */
export function Ridges({ seed, layers, drift, className }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setSize({ w: Math.round(el.clientWidth), h: Math.round(el.clientHeight) });
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useScrollFrame(() => {
    const el = box.current;
    const section = el?.closest("section");
    if (!el || !section) return;
    const r = section.getBoundingClientRect();
    const vh = innerHeight;
    const p = drift === "x" ? pinProgress(r, vh) : throughProgress(r, vh);
    el.style.opacity = String(clamp(enterProgress(r, vh) * 1.5));
    const paths = el.querySelectorAll<SVGPathElement>("path");
    paths.forEach((path, i) => {
      // Nearer ridges move a touch more: depth without anything 3D.
      const k = (i + 1) / paths.length;
      path.style.transform =
        drift === "x"
          ? `translateX(${-p * innerWidth * (0.22 + 0.02 * k)}px)`
          : `translate(${-p * innerWidth * 0.06}px, ${(0.5 - p) * 24 * k}px)`;
    });
  });

  const lines = size.w && size.h ? ridgeLines({ width: size.w, height: size.h, layers, seed }) : [];
  return (
    <div ref={box} className={className ? `ridges ${className}` : "ridges"} aria-hidden="true">
      {lines.length > 0 && (
        <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="xMinYMax slice">
          {lines.map((ys, i) => (
            <path key={i} d={toPath(ys)} style={{ strokeOpacity: `calc(var(--lo, 1) * ${(0.07 + (0.17 * i) / Math.max(1, layers - 1)).toFixed(3)})` }} />
          ))}
        </svg>
      )}
    </div>
  );
}
