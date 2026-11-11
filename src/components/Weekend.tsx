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

  // Swiping is the browser's own scrolling (with CSS snap, one card at a time).
  // The only help it gets: while a touch is moving mostly up or down, the track
  // is held still, so scrolling the page never drags the cards sideways.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let x = 0;
    let y = 0;
    let left = 0;
    let decided = false;
    const start = (e: TouchEvent) => {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
      left = el.scrollLeft;
      decided = false;
    };
    const move = (e: TouchEvent) => {
      if (decided) return;
      const dx = Math.abs(e.touches[0].clientX - x);
      const dy = Math.abs(e.touches[0].clientY - y);
      if (dx < 6 && dy < 6) return;
      decided = true;
      if (dy > dx) {
        el.style.overflowX = "hidden";
        el.scrollLeft = left;
      }
    };
    const end = () => {
      el.style.overflowX = "";
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
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
