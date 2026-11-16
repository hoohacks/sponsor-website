import { useRef } from "react";
import { stats } from "../content";
import { clamp, ease, pinProgress, useScrollFrame } from "../lib/scroll";
import { Ridges } from "./Ridges";

const FIGURES: [string, string][] = [
  [stats.participants, "students"],
  [stats.schools, "schools"],
  [stats.states, "states"],
  [stats.projects, "projects"],
  [stats.womenPlus, "women and non-binary"],
  [stats.sponsors, "sponsors"],
  [stats.partners, "partners"],
];

/**
 * Last year's figures on one line too wide for the screen, sliding past while
 * the section is pinned. As it finishes, the weekend's heading rises in below,
 * so the photo scenes follow with no empty screen in between.
 */
export function StatsLine() {
  const section = useRef<HTMLElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const next = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    if (!section.current || !line.current || !next.current) return;
    const p = pinProgress(section.current.getBoundingClientRect(), innerHeight);
    line.current.style.transform = `translateX(${-p * Math.max(0, line.current.scrollWidth - innerWidth)}px)`;
    const n = ease(clamp((p - 0.62) / 0.3));
    next.current.style.opacity = String(n);
    next.current.style.transform = `translateY(${(1 - n) * 40}px)`;
  });

  return (
    <section className="stats" id="stats" ref={section} aria-label={`${stats.label} in numbers`}>
      <div className="stats__pin">
        <Ridges seed={11} layers={6} drift="x" className="stats__ridges" />
        <ul className="visually-hidden">
          {FIGURES.map(([n, w]) => (
            <li key={w}>{`${n} ${w}`}</li>
          ))}
        </ul>
        <div className="stats__line" ref={line} aria-hidden="true">
          {FIGURES.map(([n, w]) => (
            <div key={w}>
              <b>{n}</b>
              <span>{w}</span>
            </div>
          ))}
        </div>
        <div className="stats__next" ref={next}>
          <div className="wrap">
            <h2>
              Twenty-four hours <br />
              in Charlottesville.
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
