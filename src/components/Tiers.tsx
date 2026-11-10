import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { addOns, benefits, tiers } from "../content";
import { formatPrice } from "../lib/format";
import { benefitsForTier } from "../lib/tiers";

interface Props {
  /** Called when someone asks about a tier, so the form can mention it. */
  onAsk: (tierName: string) => void;
}

const MAX = Math.max(...tiers.map((t) => t.price));
/** Column height grows with price (square-root scale so Bronze isn't a sliver). */
const stepHeight = (price: number) => `${Math.round(42 + 58 * Math.sqrt(price / MAX))}%`;

export function Tiers({ onAsk }: Props) {
  const [active, setActive] = useState(2);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, Home: -active, End: tiers.length - 1 - active };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + tiers.length) % tiers.length;
    setActive(next);
    stepRefs.current[next]?.focus();
  };

  const tier = tiers[active];
  const included = benefitsForTier(benefits, active);
  const groups = [...new Set(addOns.map((a) => a.group))];

  return (
    <section className="tiers" id="tiers" aria-labelledby="tiers-title">
      <div className="wrap">
        <p className="kicker">Sponsorship tiers</p>
        <h2 id="tiers-title">Choose your level.</h2>

        <div className="stairs" role="tablist" aria-label="Sponsorship tier" onKeyDown={onKeyDown}>
          {tiers.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className="step"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls="tier-panel"
              tabIndex={i === active ? 0 : -1}
              style={{ "--h": stepHeight(t.price) } as CSSProperties}
              onClick={() => setActive(i)}
            >
              <span className="step__name">{t.name}</span>
              <span className="step__price">{formatPrice(t.price)}</span>
            </button>
          ))}
        </div>

        <div className="tier-detail" id="tier-panel" role="tabpanel" aria-labelledby={`tab-${tier.id}`}>
          <div className="tier-detail__side" key={`side-${tier.id}`}>
            <p className="tier-detail__count">
              <strong>{included.length}</strong> of {benefits.flatMap((g) => g.benefits).length} benefits
            </p>
            <p className="tier-detail__pitch">{tier.pitch}</p>
            <a className="btn btn--navy" href="#contact" onClick={() => onAsk(tier.name)}>
              Ask about {tier.name}
            </a>
          </div>
          <ul className="tier-detail__list" key={`list-${tier.id}`}>
            {included.map((b) => (
              <li key={b.label} data-change={b.change ?? undefined}>
                <Check />
                <span>
                  {b.label}
                  {b.detail && <small>{b.detail}</small>}
                </span>
                {b.change && <em>{b.change === "new" ? "New" : "Upgraded"}</em>}
              </li>
            ))}
          </ul>
        </div>

        <details className="compare">
          <summary>Compare every tier</summary>
          <div className="compare__scroll">
            <table>
              <caption className="visually-hidden">Benefits included at each sponsorship tier</caption>
              <thead>
                <tr>
                  <th scope="col">Benefit</th>
                  {tiers.map((t) => (
                    <th scope="col" key={t.id}>
                      {t.name}
                      <span>{formatPrice(t.price)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              {benefits.map((g) => (
                <tbody key={g.group}>
                  <tr className="compare__group">
                    <th scope="colgroup" colSpan={6}>
                      {g.group}
                    </th>
                  </tr>
                  {g.benefits.map((b) => (
                    <tr key={b.label}>
                      <th scope="row" style={{ fontWeight: 500 }}>
                        {b.label}
                      </th>
                      {b.cells.map((c, i) => (
                        <td key={i}>
                          {c === true ? (
                            <span className="compare__yes" role="img" aria-label="Included" />
                          ) : c ? (
                            c
                          ) : (
                            <span className="compare__no" aria-label="Not included">
                              –
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </details>

        <div className="menu">
          <div className="menu__intro">
            <h3>À la carte</h3>
            <p>Add any of these to your tier. Meal prices depend on whether it's breakfast, lunch, or dinner.</p>
          </div>
          <div className="menu__groups">
            {groups.map((g) => (
              <div className="menu__group" key={g}>
                <h4>{g}</h4>
                <ul>
                  {addOns
                    .filter((a) => a.group === g)
                    .map((a) => (
                      <li key={a.name}>
                        <span className="menu__name">{a.name}</span>
                        <span className="menu__req">{a.minTier} and up</span>
                        <span className="menu__price">{a.price}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg className="check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
