import type { CSSProperties } from "react";
import { sponsors } from "../content";
import { logoSize } from "../lib/format";

export function Logos() {
  return (
    <section className="logos" aria-labelledby="logos-title">
      <div className="wrap">
        <h2 id="logos-title">Past sponsors and partners</h2>
        <ul>
          {sponsors.map((s, i) => {
            const { w, h } = logoSize(s.ratio, { area: 3000, maxH: 50, maxW: 160 });
            return (
              <li key={s.file} data-reveal="fade" style={{ "--i": i, "--stagger": "45ms" } as CSSProperties}>
                <img src={`/logos/${s.file}.png`} alt={s.name} width={w} height={h} loading="lazy" decoding="async" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
