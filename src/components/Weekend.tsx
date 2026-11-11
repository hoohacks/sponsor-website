import { useEffect, useRef, useState, type CSSProperties } from "react";
import { weekend } from "../content";
import { Photo } from "./Photo";

export function Weekend() {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Touch swipes are handled here rather than by native scrolling. The track
  // only lets the browser pan vertically (touch-action: pan-y), so a swipe is
  // either a page scroll or a card change, never both at once, and each swipe
  // moves exactly one card.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let id = -1;
    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastTime = 0;
    let speed = 0;
    let dragging = false;
    let release = 0;
    const cardStep = () => (el.querySelector<HTMLElement>(".moment")?.offsetWidth ?? 0) + 20;

    const settle = (index: number) => {
      const last = el.querySelectorAll(".moment").length - 1;
      const to = Math.max(0, Math.min(last, index));
      const from = el.scrollLeft;
      const target = Math.min(to * cardStep(), el.scrollWidth - el.clientWidth);
      const began = performance.now();
      const length = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;
      // Glide to the card ourselves; snapping stays off until we land, or it would fight us.
      const glide = (now: number) => {
        const t = length ? Math.min(1, (now - began) / length) : 1;
        el.scrollLeft = from + (target - from) * (1 - (1 - t) ** 3);
        if (t < 1) release = requestAnimationFrame(glide);
        else delete el.dataset.dragging;
      };
      release = requestAnimationFrame(glide);
    };

    const down = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      cancelAnimationFrame(release);
      id = e.pointerId;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastTime = e.timeStamp;
      speed = 0;
      dragging = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) < 4) return;
      dragging = true;
      el.dataset.dragging = "true";
      speed = (e.clientX - lastX) / Math.max(1, e.timeStamp - lastTime);
      lastX = e.clientX;
      lastTime = e.timeStamp;
      el.scrollLeft = startLeft - dx;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      if (!dragging) return;
      const size = cardStep();
      const from = Math.round(startLeft / size);
      const dx = e.clientX - startX;
      const next = dx < -size * 0.18 || speed < -0.3 ? 1 : dx > size * 0.18 || speed > 0.3 ? -1 : 0;
      settle(from + next);
    };
    // The browser took the gesture over (a vertical scroll): go back where we were.
    const cancel = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      if (dragging) settle(Math.round(startLeft / cardStep()));
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    return () => {
      cancelAnimationFrame(release);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>(".moment");
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: "smooth" });
  };

  return (
    <section className="reel" id="weekend" aria-labelledby="weekend-title">
      <div className="wrap reel__head">
        <div>
          <h2 id="weekend-title">
            <span className="nowrap">24 hours,</span> start to finish.
          </h2>
        </div>
        <div className="reel__arrows">
          <button type="button" aria-label="Previous moment" onClick={() => step(-1)} disabled={edges.start}>
            <Arrow dir="left" />
          </button>
          <button type="button" aria-label="Next moment" onClick={() => step(1)} disabled={edges.end}>
            <Arrow dir="right" />
          </button>
        </div>
      </div>
      <div className="reel__track" ref={track} tabIndex={0} aria-label="Moments from a HooHacks weekend">
        {weekend.map((m, i) => (
          <article className="moment" key={m.title} data-reveal="slide" style={{ "--i": i } as CSSProperties}>
            <div className="moment__img">
              <Photo name={m.photo} alt={m.title} sizes="(max-width: 640px) 82vw, 420px" />
            </div>
            <p className="moment__when">{m.when}</p>
            <h3>{m.title}</h3>
            <p>{m.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M11 4L6 9l5 5" : "M7 4l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
