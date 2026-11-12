import type { CSSProperties } from "react";
import { stats } from "../content";
import { CountUp } from "./CountUp";
import { Photo } from "./Photo";

export function StatsSentence() {
  return (
    <section className="sentence" id="overview" aria-label={`${stats.label} in numbers`}>
      <div className="wrap">
        <header className="sentence__header" data-reveal="fade" style={{ "--i": 0 } as CSSProperties}>
          <span className="sentence__kicker">{stats.label} by the numbers</span>
          <p className="sentence__statement">
            <span className="sentence__hl">
              <CountUp value={stats.participants} />
            </span>{" "}
            students from <CountUp value={stats.schools} /> schools and{" "}
            <CountUp value={stats.states} /> states built{" "}
            <span className="sentence__hl">
              <CountUp value={stats.projects} />
            </span>{" "}
            projects in one weekend, with{" "}
            <span className="sentence__hl">
              <CountUp value={stats.sponsors} />
            </span>{" "}
            sponsors and <CountUp value={stats.partners} /> partners in the room.
          </p>
        </header>

        {/* Highlighted Women+ in Tech diversity achievement */}
        <div className="sentence__diversity" data-reveal="rise" style={{ "--i": 1 } as CSSProperties}>
          <div className="sentence__diversity-main">
            <div className="sentence__diversity-stat-block">
              <span className="sentence__diversity-stat">
                <CountUp value={stats.womenPlus} />
              </span>
              <div className="sentence__diversity-info">
                <span className="sentence__diversity-title">Women+ in Tech</span>
                <span className="sentence__diversity-badge">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M8 2l5 6h-3v6H6V8H3l5-6z" />
                  </svg>
                  +5% above MLH national average ({stats.mlhAverageWomenPlus})
                </span>
              </div>
            </div>
            <p className="sentence__diversity-text">
              {stats.label} set a record benchmark for gender diversity in collegiate hackathons, connecting top women
              and non-binary builders directly with sponsor engineers and hiring managers.
            </p>
          </div>

          <div className="sentence__diversity-meter" aria-hidden="true">
            <div className="sentence__meter-row">
              <span className="sentence__meter-name">HooHacks 2026</span>
              <span className="sentence__meter-val">{stats.womenPlus}</span>
            </div>
            <div className="sentence__meter-track">
              <div className="sentence__meter-bar sentence__meter-bar--hoohacks" style={{ width: "29%" }} />
            </div>
            <div className="sentence__meter-row sentence__meter-row--muted">
              <span className="sentence__meter-name">MLH National Average</span>
              <span className="sentence__meter-val">{stats.mlhAverageWomenPlus}</span>
            </div>
            <div className="sentence__meter-track">
              <div className="sentence__meter-bar sentence__meter-bar--mlh" style={{ width: "24%" }} />
            </div>
          </div>
        </div>

        {/* Event visual proof cards: moved cleanly out of the sentence into dedicated frames */}
        <div className="sentence__gallery" data-reveal="rise" style={{ "--i": 2 } as CSSProperties}>
          <figure className="sentence__card">
            <div className="sentence__card-img">
              <Photo
                name="atrium"
                alt="Hackers packed into Rice Hall atrium during HooHacks"
                sizes="(max-width: 760px) 100vw, 360px"
              />
            </div>
            <figcaption className="sentence__card-body">
              <strong className="sentence__card-stat">{stats.participants} Builders</strong>
              <span className="sentence__card-label">Rice Hall Atrium packed across 18 states</span>
            </figcaption>
          </figure>

          <figure className="sentence__card sentence__card--featured">
            <div className="sentence__card-img">
              <Photo
                name="crowd-smiles"
                alt="Hackers smiling and celebrating together at HooHacks"
                sizes="(max-width: 760px) 100vw, 360px"
              />
            </div>
            <figcaption className="sentence__card-body">
              <strong className="sentence__card-stat">{stats.womenPlus} Women+ Hackers</strong>
              <span className="sentence__card-label">Fostering an inclusive engineering culture</span>
            </figcaption>
          </figure>

          <figure className="sentence__card">
            <div className="sentence__card-img">
              <Photo
                name="booth"
                alt="Sponsor representatives mentoring students at their booth"
                sizes="(max-width: 760px) 100vw, 360px"
              />
            </div>
            <figcaption className="sentence__card-body">
              <strong className="sentence__card-stat">{stats.sponsors} Sponsors & {stats.partners} Partners</strong>
              <span className="sentence__card-label">Direct mentorship, demos, and recruiting</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
