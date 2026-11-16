import { useRef } from "react";
import { sponsors } from "../content";
import { logoSize } from "../lib/format";
import { throughProgress, useScrollFrame } from "../lib/scroll";
import { Ridges } from "./Ridges";

type Sponsor = (typeof sponsors)[number];
const half = Math.ceil(sponsors.length / 2);
const rows = [sponsors.slice(0, half), sponsors.slice(half)];

/** One row of logos, twice over so it fills the width; the second copy is hidden from assistive tech. */
function Row({ list, rowRef }: { list: Sponsor[]; rowRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div className="sponsors__row" ref={rowRef}>
      {[0, 1].map((copy) =>
        list.map((s) => {
          const { w, h } = logoSize(s.ratio, { area: 2400, maxH: 48, maxW: 170 });
          return (
            <img
              key={`${copy}-${s.file}`}
              src={`/logos/${s.file}.png`}
              alt={copy ? "" : s.name}
              aria-hidden={copy ? true : undefined}
              width={w}
              height={h}
              loading="lazy"
              decoding="async"
            />
          );
        }),
      )}
    </div>
  );
}

/** Past sponsors in two rows that drift in opposite directions as you scroll. */
export function Logos() {
  const section = useRef<HTMLElement>(null);
  const rowEls = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame(() => {
    if (!section.current) return;
    const t = throughProgress(section.current.getBoundingClientRect(), innerHeight);
    const [a, b] = rowEls.current;
    if (a) a.style.transform = `translateX(${-t * 40}vw)`;
    if (b) b.style.transform = `translateX(${-60 + t * 40}vw)`;
  });

  return (
    <section className="sponsors" id="sponsors" ref={section} aria-labelledby="sponsors-title">
      <Ridges seed={41} layers={5} drift="y" className="sponsors__ridges" />
      <div className="wrap" data-rise>
        <h2 id="sponsors-title">
          Past sponsors <br />
          and partners.
        </h2>
      </div>
      {rows.map((list, i) => (
        <Row
          key={i}
          list={list}
          rowRef={(el) => {
            rowEls.current[i] = el;
          }}
        />
      ))}
    </section>
  );
}
