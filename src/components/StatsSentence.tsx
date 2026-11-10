import type { CSSProperties } from "react";
import { stats } from "../content";
import { CountUp } from "./CountUp";

const chip = (src: string, i: number) => (
  <img
    className="sentence__chip"
    src={src}
    alt=""
    aria-hidden="true"
    loading="lazy"
    data-reveal="pop"
    style={{ "--i": i } as CSSProperties}
  />
);

export function StatsSentence() {
  return (
    <section className="sentence" id="overview" aria-label={`${stats.label} in numbers`}>
      <div className="wrap">
        <p>
          <span className="sentence__hl">
            <CountUp value={stats.participants} />
          </span>{" "}
          students {chip("/img/atrium-800.webp", 2)} from <CountUp value={stats.schools} /> schools and{" "}
          <CountUp value={stats.states} /> states built{" "}
          <span className="sentence__hl">
            <CountUp value={stats.projects} />
          </span>{" "}
          projects {chip("/proj/sun-800.webp", 5)} in one weekend, with{" "}
          <span className="sentence__hl">
            <CountUp value={stats.sponsors} />
          </span>{" "}
          sponsors {chip("/img/booth-800.webp", 8)} and <CountUp value={stats.partners} /> partners in the room.
        </p>
        <small>
          {stats.label}. {stats.womenPlus} of hackers were women+, against an MLH average of {stats.mlhAverageWomenPlus}.
        </small>
      </div>
    </section>
  );
}
