import { useRef } from "react";
import { weekend } from "../content";
import { clamp, ease, useScrollFrame } from "../lib/scroll";
import { DuoPhoto } from "./DuoPhoto";

/**
 * The weekend as five full-screen scenes. Each sticks, comes into color, and
 * is covered by the next one sliding up while it sinks back slightly.
 */
export function Weekend() {
  const scenes = useRef<(HTMLElement | null)[]>([]);

  useScrollFrame(() => {
    const vh = innerHeight;
    const shown = scenes.current.map((s) => (s ? clamp((vh - s.getBoundingClientRect().top) / vh) : 0));
    scenes.current.forEach((s, i) => {
      if (!s) return;
      const cover = shown[i + 1] ?? 0;
      const photo = s.querySelector<HTMLElement>(".scene__photo");
      const dim = s.querySelector<HTMLElement>(".scene__dim");
      if (photo) {
        photo.style.setProperty("--color", String(ease(clamp((shown[i] - 0.4) / 0.6))));
        photo.style.transform = `scale(${1 - cover * 0.08})`;
      }
      if (dim) dim.style.opacity = String(cover * 0.7);
    });
  });

  return (
    <section className="weekend" id="weekend" aria-label="The weekend">
      {weekend.map((m, i) => (
        <article
          className="scene"
          key={m.title}
          ref={(el) => {
            scenes.current[i] = el;
          }}
        >
          <DuoPhoto name={m.photo} alt={m.alt} sizes="100vw" className="scene__photo" />
          <div className="scene__dim" />
          <div className="scene__copy">
            <div className="wrap">
              <p className="scene__time" data-rise="left" data-end="0.75">
                <small>{m.day}</small>
                {m.time}
              </p>
              <div>
                <h3 data-rise="right" data-end="0.75">
                  {m.title}
                </h3>
                <p data-rise="right" data-i="1" data-end="0.75">
                  {m.body}
                </p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
