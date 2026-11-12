import { useState, type CSSProperties } from "react";
import { stats } from "../content";
import { CountUp } from "./CountUp";
import { Photo } from "./Photo";

type ImageLayout = "cards" | "flanking" | "stack";

export function StatsSentence() {
  const [layout, setLayout] = useState<ImageLayout>("cards");

  return (
    <section
      className={`sentence sentence--layout-${layout}`}
      id="overview"
      aria-label={`${stats.label} in numbers`}
    >
      <div className="wrap">
        {/* Layout switcher allowing live experimentation with photo integration */}
        <div className="sentence__toolbar" data-reveal="fade" style={{ "--i": 0 } as CSSProperties}>
          <span className="sentence__kicker">{stats.label} by the numbers</span>
          <div className="sentence__layout-picker" role="group" aria-label="Photo integration options">
            <span className="sentence__layout-label">Photo style:</span>
            <button
              type="button"
              className="sentence__layout-btn"
              data-active={layout === "cards" || undefined}
              onClick={() => setLayout("cards")}
              aria-pressed={layout === "cards"}
            >
              Photo Cards
            </button>
            <button
              type="button"
              className="sentence__layout-btn"
              data-active={layout === "flanking" || undefined}
              onClick={() => setLayout("flanking")}
              aria-pressed={layout === "flanking"}
            >
              Flanking Frames
            </button>
            <button
              type="button"
              className="sentence__layout-btn"
              data-active={layout === "stack" || undefined}
              onClick={() => setLayout("stack")}
              aria-pressed={layout === "stack"}
            >
              Fan Stack
            </button>
          </div>
        </div>

        {/* Flanking photo 1: left side (only visible in flanking layout) */}
        {layout === "flanking" && (
          <aside className="sentence__flank sentence__flank--left" aria-hidden="true">
            <figure className="sentence__polaroid sentence__polaroid--atrium">
              <div className="sentence__polaroid-media">
                <Photo
                  name="atrium"
                  alt="Hackers packed into Rice Hall atrium during HooHacks"
                  sizes="260px"
                />
              </div>
              <figcaption className="sentence__polaroid-cap">
                <strong>760+ Builders</strong>
                <span>Rice Hall Atrium</span>
              </figcaption>
            </figure>
          </aside>
        )}

        {/* Central narrative text */}
        <div className="sentence__center">
          <p className="sentence__statement" data-reveal="rise" style={{ "--i": 1 } as CSSProperties}>
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

          {/* Tastefully integrated Women+ statistic: clean, dignified, not over-bolded */}
          <p className="sentence__sub" data-reveal="fade" style={{ "--i": 2 } as CSSProperties}>
            <span className="sentence__sub-tag">{stats.label}</span>
            <span className="sentence__sub-sep" aria-hidden="true">·</span>
            <span>
              <strong>{stats.womenPlus}</strong> of hackers were women+, against an MLH average of {stats.mlhAverageWomenPlus}.
            </span>
          </p>
        </div>

        {/* Flanking photo 2 & 3: right side (only visible in flanking layout) */}
        {layout === "flanking" && (
          <aside className="sentence__flank sentence__flank--right" aria-hidden="true">
            <figure className="sentence__polaroid sentence__polaroid--smiles">
              <div className="sentence__polaroid-media">
                <Photo
                  name="crowd-smiles"
                  alt="Hackers smiling and celebrating together at HooHacks"
                  sizes="240px"
                />
              </div>
              <figcaption className="sentence__polaroid-cap">
                <strong>Inclusive Community</strong>
                <span>{stats.womenPlus} Women+ Builders</span>
              </figcaption>
            </figure>

            <figure className="sentence__polaroid sentence__polaroid--booth">
              <div className="sentence__polaroid-media">
                <Photo
                  name="booth"
                  alt="Sponsor representatives mentoring students at their booth"
                  sizes="240px"
                />
              </div>
              <figcaption className="sentence__polaroid-cap">
                <strong>15 Sponsors</strong>
                <span>Mentorship & hiring</span>
              </figcaption>
            </figure>
          </aside>
        )}

        {/* Layout: Clean Photo Cards Trio */}
        {layout === "cards" && (
          <div className="sentence__gallery">
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

            <figure className="sentence__card">
              <div className="sentence__card-img">
                <Photo
                  name="crowd-smiles"
                  alt="Hackers smiling and celebrating together at HooHacks"
                  sizes="(max-width: 760px) 100vw, 360px"
                />
              </div>
              <figcaption className="sentence__card-body">
                <strong className="sentence__card-stat">Builder Community</strong>
                <span className="sentence__card-label">{stats.womenPlus} Women+ hackers in tech</span>
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
                <span className="sentence__card-label">Direct mentorship and recruiting</span>
              </figcaption>
            </figure>
          </div>
        )}

        {/* Layout: Interactive Overlapping Fan Stack */}
        {layout === "stack" && (
          <div className="sentence__stack-wrap">
            <div className="sentence__stack" tabIndex={0} aria-label="Photo stack: hover or tap to fan out">
              <figure className="sentence__stack-card sentence__stack-card--1">
                <Photo
                  name="atrium"
                  alt="Rice Hall Atrium packed with students"
                  sizes="320px"
                />
                <span className="sentence__stack-badge">760+ Builders</span>
              </figure>
              <figure className="sentence__stack-card sentence__stack-card--2">
                <Photo
                  name="crowd-smiles"
                  alt="Diverse hackers smiling together"
                  sizes="320px"
                />
                <span className="sentence__stack-badge">Community ({stats.womenPlus})</span>
              </figure>
              <figure className="sentence__stack-card sentence__stack-card--3">
                <Photo
                  name="booth"
                  alt="Sponsor booths and mentors"
                  sizes="320px"
                />
                <span className="sentence__stack-badge">15 Sponsors</span>
              </figure>
            </div>
            <p className="sentence__stack-hint" aria-hidden="true">
              Hover to fan out photos
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
