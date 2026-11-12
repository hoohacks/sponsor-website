import { stats } from "../content";
import { CountUp } from "./CountUp";
import { Photo } from "./Photo";

export function StatsSentence() {
  return (
    <section className="sentence" id="overview" aria-label={`${stats.label} in numbers`}>
      <div className="wrap">
        <p className="sentence__statement" data-reveal="rise">
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
        <p className="sentence__sub" data-reveal="fade">
          <span className="sentence__sub-tag">{stats.label}</span>
          <span className="sentence__sub-sep" aria-hidden="true">·</span>
          <span>
            <strong>{stats.womenPlus}</strong> of hackers were women+, against an MLH average of {stats.mlhAverageWomenPlus}.
          </span>
        </p>

        {/* Photo cards: dedicated frames placed cleanly below the statement */}
        <div className="sentence__gallery" data-reveal="rise">
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
      </div>
    </section>
  );
}
