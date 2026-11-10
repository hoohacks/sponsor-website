import { stats } from "../content";

const chip = (src: string) => <img className="sentence__chip" src={src} alt="" aria-hidden="true" loading="lazy" />;

export function StatsSentence() {
  return (
    <section className="sentence" aria-label={`${stats.label} in numbers`}>
      <div className="wrap">
        <p>
          <span className="sentence__hl">{stats.participants}</span> students {chip("/img/opening-800.webp")} from{" "}
          {stats.schools} schools and {stats.states} states built <span className="sentence__hl">{stats.projects}</span>{" "}
          projects {chip("/proj/sun-800.webp")} in one weekend, with{" "}
          <span className="sentence__hl">{stats.sponsors}</span> sponsors {chip("/img/sponsor-table-800.webp")} in the
          room.
        </p>
        <small>
          {stats.label}. {stats.womenPlus} of hackers were women+, against an MLH average of {stats.mlhAverageWomenPlus}.
        </small>
      </div>
    </section>
  );
}
