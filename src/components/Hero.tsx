import { useEffect, useRef, useState, type CSSProperties } from "react";
import { clamp, ease, inOut, lerp, pinProgress, useScrollFrame } from "../lib/scroll";
import { DuoPhoto } from "./DuoPhoto";

// Jefferson on founding the University of Virginia, letter to William Roscoe, 1820.
const HEADLINE = "This institution will be based on the illimitable freedom of the human mind.";

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
 * The hall comes into color while the outlined headline fills in, left to
 * right, with the scroll. Then the supporting line and buttons rise in.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const solid = useRef<HTMLSpanElement>(null);
  const row = useRef<HTMLDivElement>(null);
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

  useScrollFrame(() => {
    if (!section.current || !photo.current || !solid.current || !row.current || !cue.current) return;
    const p = pinProgress(section.current.getBoundingClientRect(), innerHeight);
    photo.current.style.transform = `scale(${lerp(1.14, 1, ease(p))})`;
    photo.current.style.setProperty("--color", String(clamp((p - 0.1) / 0.6)));
    solid.current.style.clipPath = `inset(0 ${100 - inOut(clamp(p / 0.7)) * 100}% 0 0)`;
    const r = ease(clamp((p - 0.68) / 0.22));
    row.current.style.opacity = String(r);
    row.current.style.transform = `translateY(${(1 - r) * 20}px)`;
    cue.current.style.opacity = String(1 - clamp(p / 0.06));
  });

  return (
    <section className={ready ? "hero hero--ready" : "hero"} id="hero" ref={section}>
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
            <p className="hero__when">March 2027, University of Virginia</p>
            <h1 className="hero__title">
              <span className="hero__outline">
                <span className="visually-hidden">{HEADLINE}</span>
                <span aria-hidden="true">
                  <Words />
                </span>
              </span>
              <span className="hero__solid" ref={solid} aria-hidden="true">
                <Words />
              </span>
            </h1>
            <p className="hero__cite">Thomas Jefferson, on founding the University of Virginia, 1820</p>
            <div className="hero__row" ref={row}>
              <p>HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes.</p>
              <div className="hero__ctas">
                <a className="hero__link" href="#contact">
                  Become a sponsor
                </a>
                <a className="hero__link hero__link--quiet" href="#tiers">
                  See packages
                </a>
              </div>
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
