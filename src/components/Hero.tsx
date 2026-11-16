import { useEffect, useRef, useState, type CSSProperties } from "react";
import { event } from "../content";
import { clamp, useScrollFrame } from "../lib/scroll";
import { DuoPhoto } from "./DuoPhoto";

// Jefferson on founding the University of Virginia, letter to William Roscoe, 1820.
const HEADLINE = "The illimitable freedom of the human mind.";

/** The headline as separate words, so each can rise in when the page opens. */
const Words = () => (
  <>
    {HEADLINE.split(" ").map((w, i) => (
      <span key={i}>
        {/* Each word slides up from behind its own mask when the page opens. */}
        <span className="hero__mask">
          <span className="hero__word" style={{ "--w": i } as CSSProperties}>
            {w}
          </span>
        </span>{" "}
      </span>
    ))}
  </>
);

/**
 * One screen, all automatic: when the site opens, the hall opens up and comes
 * into color, the headline rises in and fills solid, and the description
 * follows. Scrolling just moves on to the next section.
 */
export function Hero() {
  const photo = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  // The opening plays once the hall photo is ready, so the curtain never opens on an empty screen.
  // If the photo is slow, it plays anyway after a moment.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = photo.current?.querySelector("img");
    if (img?.complete && img.naturalWidth > 0) setReady(true);
    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // The scroll cue fades as soon as someone starts scrolling.
  useScrollFrame(() => {
    if (cue.current) cue.current.style.opacity = String(1 - clamp(scrollY / 120));
  });

  return (
    <section className={ready ? "hero hero--ready" : "hero"} id="hero">
      <div className="hero__pin">
        <img className="hero__mark" src="/img/logo-long-white.svg" alt="HooHacks" width={159} height={22} />
        <div className="hero__photo" ref={photo}>
          <DuoPhoto
            name="opening-crowd"
            alt="Hackers filling the lecture hall for the opening ceremony"
            sizes="100vw"
            loading="eager"
            onLoad={() => setReady(true)}
          />
        </div>
        <div className="hero__copy">
          <div className="wrap">
            <p className="hero__when">{event.dateLine}</p>
            <h1 className="hero__title">
              <span className="hero__outline">
                <span className="visually-hidden">{HEADLINE}</span>
                <span aria-hidden="true">
                  <Words />
                </span>
              </span>
              <span className="hero__solid" aria-hidden="true">
                <Words />
              </span>
            </h1>
            <p className="hero__cite">Thomas Jefferson</p>
            <div className="hero__row">
              <p>HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes.</p>
            </div>
          </div>
        </div>
        <div className="hero__cue" ref={cue} aria-hidden="true">
          <i />
        </div>
      </div>
    </section>
  );
}
