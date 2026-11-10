import { useState, type CSSProperties } from "react";
import { event, heroPhotos } from "../content";
import { Photo } from "./Photo";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Hero() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="hero__when" data-enter style={i(0)}>
          {event.dateLine}
        </p>
        <h1 data-enter style={i(1)}>
          Meet the people building{" "}
          <span className="hero__mark">
            what's next.
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 15 C 60 7, 120 6, 180 9 S 270 14, 296 8" pathLength={1} />
            </svg>
          </span>
        </h1>
        <p className="hero__lede" data-enter style={i(2)}>
          HooHacks brings 760+ students from across the country to Charlottesville for one weekend.
        </p>
        <div className="hero__ctas" data-enter style={i(3)}>
          <a className="btn" href="#contact">
            Become a sponsor
          </a>
          <a className="btn btn--outline" href="#tiers">
            See packages
          </a>
        </div>
      </div>

      {/* An endless, slow strip of event photos. The list is rendered twice so the loop is seamless. */}
      <div className="strip" data-enter style={i(4)} data-paused={paused}>
        <div className="strip__track">
          {[0, 1].map((copy) => (
            <div className="strip__set" key={copy} aria-hidden={copy === 1 || undefined}>
              {heroPhotos.map((p, n) => (
                <div className="strip__photo" key={p.photo}>
                  <Photo
                    name={p.photo}
                    alt={copy === 1 ? "" : p.alt}
                    sizes="(max-width: 640px) 60vw, 360px"
                    loading={n < 5 ? "eager" : "lazy"}
                    fetchPriority={copy === 0 && n === 2 ? "high" : "auto"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button
          type="button"
          className="strip__toggle"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Play the photo strip" : "Pause the photo strip"}
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
