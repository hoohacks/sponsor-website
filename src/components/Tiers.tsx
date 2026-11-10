import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { addOns, benefits, tiers } from "../content";
import { formatPrice } from "../lib/format";
import { benefitsForTier } from "../lib/tiers";

interface Props {
  /** Called when someone asks about a tier, so the form can mention it. */
  onAsk: (tierName: string) => void;
}

export function Tiers({ onAsk }: Props) {
  const [active, setActive] = useState(2);
  const [instant, setInstant] = useState(true);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Move the single sliding pill under the selected tab.
  useLayoutEffect(() => {
    const place = () => {
      const tab = tabRefs.current[active];
      const list = tabsRef.current;
      if (!tab || !list) return;
      list.style.setProperty("--x", `${tab.offsetLeft}px`);
      list.style.setProperty("--y", `${tab.offsetTop}px`);
      list.style.setProperty("--w", `${tab.offsetWidth}px`);
      list.style.setProperty("--h", `${tab.offsetHeight}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  const select = (i: number, viaKeyboard: boolean) => {
    // Keyboard moves are instant: animating repeated key presses feels slow.
    setInstant(viaKeyboard);
    setActive(i);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, Home: -active, End: tiers.length - 1 - active };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (active + keys[e.key] + tiers.length) % tiers.length;
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  const tier = tiers[active];
  const included = benefitsForTier(benefits, active);

  return (
    <section className="tiers" id="tiers" aria-labelledby="tiers-title">
      <div className="wrap">
        <p className="kicker">Sponsorship tiers</p>
        <h2 id="tiers-title">Choose your level.</h2>

        <div className="tabs" role="tablist" aria-label="Sponsorship tier" ref={tabsRef} data-instant={instant} onKeyDown={onKeyDown}>
          <span className="tabs__indicator" aria-hidden="true" />
          {tiers.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className="tab"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls="tier-panel"
              tabIndex={i === active ? 0 : -1}
              style={{ "--c": t.color } as CSSProperties}
              onClick={() => select(i, false)}
            >
              <span className="tab__dot" aria-hidden="true" />
              {t.name}
            </button>
          ))}
        </div>

        <div
          className="panel"
          id="tier-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tier.id}`}
          style={{ "--c": tier.color } as CSSProperties}
        >
          <div className="panel__content" key={tier.id}>
            <div className="panel__side">
              <p className="panel__name">
                <i aria-hidden="true" />
                {tier.name}
              </p>
              <p className="panel__price">{formatPrice(tier.price)}</p>
              <p className="panel__pitch">{tier.pitch}</p>
              <a className="btn btn--navy" href="#contact" onClick={() => onAsk(tier.name)}>
                Ask about {tier.name}
              </a>
            </div>
            <div className="panel__list">
              <h3>{included.length} benefits included</h3>
              <ul>
                {included.map((b) => (
                  <li key={b.label} data-change={b.change ?? undefined}>
                    {b.label}
                    {b.change && <em>{b.change === "new" ? "New" : "Upgraded"}</em>}
                    {b.detail && <small>{b.detail}</small>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
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

        <ul className="addons" aria-label="Add-ons">
          {addOns.map((a) => (
            <li key={a.name}>
              <b>{a.name}</b>
              <span>Add-on, {a.minTier} and up</span>
              <strong>{a.price}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
