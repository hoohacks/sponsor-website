import { useEffect, useRef, useState, type CSSProperties } from "react";
import { benefits, tiers } from "../content";
import { formatPrice } from "../lib/format";
import {
  PHONE,
  pinProgress,
  railDistance,
  REDUCED,
  SHORT,
  scrollToPin,
  useMediaQuery,
  useScrollFrame,
} from "../lib/scroll";
import { addedAtTier } from "../lib/tiers";
import { AddOns } from "./AddOns";
import { Compare } from "./Compare";
import { Ridges } from "./Ridges";

interface Props {
  /** Called when someone asks about a tier, so the form can mention it. */
  onAsk: (tierName: string) => void;
}

const LAST = tiers.length - 1;

/** Sideways travel for the rail: until Diamond reaches where Bronze starts. */
function travel(rail: HTMLElement) {
  const kids = [...rail.children] as HTMLElement[];
  return railDistance(
    kids.map((k) => k.offsetLeft),
    kids[0]?.offsetLeft ?? 0,
  );
}

/**
 * The five packages. On a laptop the section pins and the tiers pass by
 * sideways; on phones and with reduced motion they simply stack.
 */
export function Tiers({ onAsk }: Props) {
  const phone = useMediaQuery(PHONE);
  const reduced = useMediaQuery(REDUCED);
  const short = useMediaQuery(SHORT);
  const stacked = phone || reduced || short;
  const track = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Focus from a click shouldn't scroll to the tier: the click is about to go somewhere else.
  const pointing = useRef(false);

  // The pinned track is as tall as the sideways distance the rail travels.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    if (stacked) {
      el.style.height = "";
      return;
    }
    const size = () => {
      const r = rail.current;
      if (r)
        el.style.height = `${travel(r) + innerHeight}px`;
    };
    size();
    addEventListener("resize", size);
    addEventListener("load", size);
    return () => {
      removeEventListener("resize", size);
      removeEventListener("load", size);
    };
  }, [stacked]);

  useScrollFrame(() => {
    if (stacked || !track.current || !rail.current) return;
    const p = pinProgress(track.current.getBoundingClientRect(), innerHeight);
    rail.current.style.transform = `translateX(${-p * travel(rail.current)}px)`;
    const i = Math.round(p * LAST);
    setActive((a) => (a === i ? a : i));
  });

  const goTo = (i: number) => {
    if (!stacked && track.current) scrollToPin(track.current, i / LAST);
  };

  return (
    <section
      className={stacked ? "tiers tiers--stacked" : "tiers"}
      id="tiers"
      aria-labelledby="tiers-title"
    >
      <div className="tiers__track" ref={track}>
        <div
          className="tiers__pin"
          // Focus can try to scroll the clipped rail sideways; the transform does that job instead.
          onScroll={(e) => {
            e.currentTarget.scrollLeft = 0;
          }}
        >
          <Ridges seed={37} layers={5} drift="x" follow=".tiers__track" className="tiers__ridges" />
          <div className="wrap tiers__head">
            <h2 id="tiers-title" data-rise="left">
              Sponsorship packages.
            </h2>
            <nav className="tiers__names" aria-label="Packages" data-rise="right">
              {tiers.map((t, i) =>
                stacked ? (
                  <a key={t.id} href={`#tier-${t.id}`}>
                    {t.name}
                  </a>
                ) : (
                  <button
                    key={t.id}
                    type="button"
                    aria-current={i === active || undefined}
                    onClick={() => goTo(i)}
                  >
                    {t.name}
                  </button>
                ),
              )}
            </nav>
          </div>
          <div className="tiers__rail" ref={rail}>
            {tiers.map((t, i) => (
              <article
                className="pkg"
                key={t.id}
                id={`tier-${t.id}`}
                aria-label={t.name}
                data-on={stacked || i === active || undefined}
                onPointerDown={() => {
                  pointing.current = true;
                }}
                onFocus={() => {
                  if (!pointing.current) goTo(i);
                  pointing.current = false;
                }}
                style={{ "--c": t.color } as CSSProperties}
              >
                <p className="pkg__name" data-rise="right" data-i={i}>
                  <i aria-hidden="true" />
                  {t.name}
                </p>
                <p className="pkg__price" data-rise="right" data-i={i}>
                  {formatPrice(t.price)}
                </p>
                <p className="pkg__pitch" data-rise="right" data-i={i + 1}>
                  {t.pitch}
                </p>
                <ul data-rise="right" data-i={i + 1}>
                  {addedAtTier(benefits, i).map((b) => (
                    <li key={b.label}>
                      <span>{b.label}</span>
                      <em>
                        {b.detail ??
                          (b.change === "upgraded" ? "Upgraded" : "")}
                      </em>
                    </li>
                  ))}
                </ul>
                {i > 0 && (
                  <p className="pkg__base">
                    Plus everything in {tiers[i - 1].name}.
                  </p>
                )}
                <a
                  className="btn btn--ghost"
                  href="#contact"
                  onClick={() => onAsk(t.name)}
                >
                  Ask about {t.name}
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap tiers__more">
        <Compare />
        <AddOns />
      </div>
    </section>
  );
}
