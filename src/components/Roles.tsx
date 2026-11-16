import { useRef } from "react";
import { roles } from "../content";
import { clamp, ease, enterProgress, throughProgress, useScrollFrame } from "../lib/scroll";
import { DuoPhoto } from "./DuoPhoto";
import { Ridges } from "./Ridges";

/** How far each photo drifts, in pixels, as the section scrolls past. */
const DRIFT = [60, -40, 90];

/** Three tall photos drifting at different speeds and coming into color. */
export function Roles() {
  const cols = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame(() => {
    const vh = innerHeight;
    cols.current.forEach((col, i) => {
      const photo = col?.querySelector<HTMLElement>(".role__photo");
      if (!col || !photo) return;
      const r = col.getBoundingClientRect();
      photo.style.transform = `translateY(${(0.5 - throughProgress(r, vh)) * DRIFT[i]}px)`;
      photo.style.setProperty("--color", String(ease(clamp(enterProgress(r, vh, 0.35) * 1.2 - 0.2))));
    });
  });

  return (
    <section className="roles" id="roles" aria-labelledby="roles-title">
      <Ridges seed={23} layers={7} drift="y" className="roles__ridges" />
      <div className="wrap">
        <div className="roles__head" data-rise>
          <h2 id="roles-title">
            Ways to get <br />
            involved.
          </h2>
          <p className="sub">Every package includes sending mentors and judges. Higher tiers add more ways to take part.</p>
        </div>
        <div className="roles__cols">
          {roles.map((r, i) => (
            <div
              className="role"
              key={r.title}
              ref={(el) => {
                cols.current[i] = el;
              }}
            >
              <DuoPhoto name={r.photo} alt={r.alt} sizes="(max-width: 760px) 100vw, 420px" className="role__photo" />
              <h3 data-rise data-i={i}>
                {r.title}
              </h3>
              <p data-rise data-i={i}>
                {r.body}
              </p>
              <span data-rise data-i={i}>
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
