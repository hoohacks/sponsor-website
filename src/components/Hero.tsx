import type { CSSProperties } from "react";
import { event, heroPhotos } from "../content";
import { Photo } from "./Photo";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <p className="hero__when" data-enter style={i(0)}>
          {event.dateLine}
        </p>
        <h1 data-enter style={i(1)}>
          Meet the people building what's next.
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
      <div className="hero__photos">
        {heroPhotos.map((p, n) => (
          <div className="hero__photo" key={p.photo} data-enter style={i(n)}>
            <Photo
              name={p.photo}
              alt={p.alt}
              sizes="(max-width: 1000px) 33vw, 22vw"
              loading="eager"
              fetchPriority={n === 2 ? "high" : "auto"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
