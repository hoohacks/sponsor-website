import { useEffect, useRef, type CSSProperties } from "react";
import { roles } from "../content";
import { columnLift, wipeAt } from "../lib/reveal";
import { clamp, ease, enterProgress, PHONE, pinProgress, REDUCED, SHORT, useMediaQuery, useScrollFrame } from "../lib/scroll";
import { insetBetween, rolesScene } from "../lib/triptych";
import { DuoPhoto } from "./DuoPhoto";
import { Ridges } from "./Ridges";

const HEAD = (
  <>
    <h2 id="roles-title">
      Ways to get <br />
      involved.
    </h2>
    <p className="sub">Every package includes sending mentors and judges. Higher tiers add more ways to take part.</p>
  </>
);

/**
 * Ways to get involved. On wide screens the section pins: the three photos
 * fill the screen edge to edge, then pull apart into framed columns as you
 * scroll, come into color, and the words rise in under each. On phones, short screens and
 * with reduced motion, the columns simply stack.
 */
export function Roles() {
  const phone = useMediaQuery(PHONE);
  const reduced = useMediaQuery(REDUCED);
  const short = useMediaQuery(SHORT);
  return phone || reduced || short ? <StackedRoles /> : <Triptych />;
}

function Triptych() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const slats = useRef<(HTMLDivElement | null)[]>([]);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const words = useRef<(HTMLDivElement | null)[]>([]);
  // Each photo's geometry inside the pinned screen: its layer, its third, its card.
  const geo = useRef<{ box: DOMRect; third: DOMRect; card: DOMRect }[]>([]);

  useEffect(() => {
    const measure = () => {
      const p = pin.current;
      if (!p || frames.current.some((f) => !f)) return;
      const o = p.getBoundingClientRect();
      const w = o.width;
      const h = o.height;
      geo.current = frames.current.map((f, i) => {
        const c = f!.getBoundingClientRect();
        const card = new DOMRect(c.left - o.left, c.top - o.top, c.width, c.height);
        const third = new DOMRect((i * w) / 3, 0, w / 3, h);
        const left = Math.min(card.left, third.left);
        const right = Math.max(card.right, third.right);
        const box = new DOMRect(left, 0, right - left, h);
        const slat = slats.current[i];
        if (slat) {
          slat.style.left = `${box.left}px`;
          slat.style.width = `${box.width}px`;
        }
        return { box, third, card };
      });
      dispatchEvent(new Event("scroll"));
    };
    measure();
    addEventListener("resize", measure);
    addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    return () => {
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
    };
  }, []);

  useScrollFrame(() => {
    if (!section.current || geo.current.length !== 3) return;
    const s = rolesScene(pinProgress(section.current.getBoundingClientRect(), innerHeight));
    geo.current.forEach(({ box, third, card }, i) => {
      const slat = slats.current[i];
      if (!slat) return;
      slat.style.clipPath = insetBetween(box, third, card, s.split);
      slat.style.setProperty("--color", String(s.color));
      slat.style.setProperty("--open", String(s.split));
    });
    if (head.current) {
      head.current.style.opacity = String(s.head);
      head.current.style.transform = `translateY(${(1 - s.head) * 50}px)`;
    }
    words.current.forEach((w, i) => {
      if (!w) return;
      w.style.opacity = String(s.text[i]);
      w.style.transform = `translateY(${(1 - s.text[i]) * 60}px)`;
    });
  });

  return (
    <section className="roles roles--pinned" id="roles" ref={section} aria-labelledby="roles-title">
      <div className="roles__pin" ref={pin}>
        <Ridges seed={23} layers={7} drift="y" className="roles__ridges" />
        <div className="roles__stage" aria-hidden="true">
          {roles.map((r, i) => (
            <div
              className="roles__slat"
              key={r.title}
              ref={(el) => {
                slats.current[i] = el;
              }}
            >
              <DuoPhoto name={r.photo} alt="" sizes="(max-width: 1400px) 40vw, 560px" />
            </div>
          ))}
        </div>
        <div className="wrap roles__front">
          <div className="roles__head" ref={head}>
            {HEAD}
          </div>
          <div className="roles__cols">
            {roles.map((r, i) => (
              <div className="role" key={r.title} style={{ "--i": i } as CSSProperties}>
                {/* Where the photo lands; the photo itself lives in the stage behind. */}
                <div
                  className="role__frame"
                  role="img"
                  aria-label={r.alt}
                  ref={(el) => {
                    frames.current[i] = el;
                  }}
                />
                <div
                  ref={(el) => {
                    words.current[i] = el;
                  }}
                >
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                  <span>{r.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedRoles() {
  const cols = useRef<(HTMLDivElement | null)[]>([]);

  useScrollFrame(() => {
    const vh = innerHeight;
    cols.current.forEach((col) => {
      const photo = col?.querySelector<HTMLElement>(".role__photo");
      if (!col || !photo) return;
      const r = col.getBoundingClientRect();
      photo.style.setProperty("--color", String(ease(clamp(enterProgress(r, vh, 0.35) * 1.2 - 0.2))));
      // The column rises into place while its photo wipes open, measured without the lift itself.
      const open = wipeAt({ top: r.top - columnLift(Number(photo.style.getPropertyValue("--open") || 1)), vh });
      photo.style.setProperty("--open", String(open));
      col.style.transform = `translateY(${columnLift(open)}px)`;
    });
  });

  return (
    <section className="roles" id="roles" aria-labelledby="roles-title">
      <Ridges seed={23} layers={7} drift="y" className="roles__ridges" />
      <div className="wrap">
        <div className="roles__head" data-rise>
          {HEAD}
        </div>
        <div className="roles__cols">
          {roles.map((r, i) => (
            <div
              className="role"
              key={r.title}
              ref={(el) => {
                cols.current[i] = el;
              }}
            >
              <DuoPhoto name={r.photo} alt={r.alt} sizes="100vw" className="role__photo" />
              <h3 data-rise>{r.title}</h3>
              <p data-rise>{r.body}</p>
              <span data-rise>{r.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
