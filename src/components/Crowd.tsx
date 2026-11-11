import { useEffect, useRef } from "react";
import { CHARLOTTESVILLE, randomUSPoint, US_ASPECT } from "../lib/crowd";

/** One dot per hacker on desktop; phones get a lighter crowd. */
const FULL = 760;
const LIGHT = 300;
/** 220 projects: dots huddle into teams of three or four. */
const TEAMS = 220;
const TIER_COUNT = 5;

interface Dot {
  x: number;
  y: number;
  /** Fixed random traits that give each dot its own place and pace. */
  a: number;
  b: number;
  c: number;
  d: number;
  map: [number, number];
  /** Last position along the closing stream, to spot when it loops. */
  flow: number;
}

type Stage = "hero" | "sentence" | "reel" | "roles" | "tiers" | "logos" | "contact";
const STAGES: Stage[] = ["hero", "sentence", "reel", "roles", "tiers", "logos", "contact"];

/**
 * The crowd: a field of dots behind the whole page that re-forms as you scroll.
 * Scattered in the hero, a map of the country in the stats band, small teams
 * through the weekend, five streams into the tiers, and one stream toward the
 * inquiry form. Purely decorative, so it is hidden from assistive tech.
 */
export function Crowd() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext?.("2d");
    if (!canvas || !ctx) return;

    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const count = innerWidth < 760 ? LIGHT : FULL;
    const size = innerWidth < 760 ? 1.6 : 2;

    const dots: Dot[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      a: Math.random(),
      b: Math.random(),
      c: Math.random(),
      d: Math.random(),
      map: i === 0 ? CHARLOTTESVILLE : randomUSPoint(),
      flow: 0,
    }));
    const teams = Array.from({ length: TEAMS }, () => [Math.random(), Math.random()]);

    const sections = new Map<Stage, HTMLElement>();
    for (const s of STAGES) {
      const el = document.querySelector<HTMLElement>(`main > .${s}`);
      if (el) sections.set(s, el);
    }
    const steps = [...document.querySelectorAll<HTMLElement>(".step")];

    let W = 0;
    let H = 0;
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let pointerX = -9999;
    let pointerY = -9999;
    const onPointer = (e: PointerEvent) => {
      pointerX = e.clientX;
      pointerY = e.clientY;
    };
    const onLeave = () => (pointerX = pointerY = -9999);

    let lastScroll = scrollY;
    let lastTime = 0;
    let lastStage: Stage | null = null;
    let raf = 0;

    const frame = (time: number) => {
      const dt = Math.min(64, time - lastTime || 16);
      lastTime = time;

      // Dots ride along with the page, then ease toward their place.
      const scrolled = scrollY - lastScroll;
      lastScroll = scrollY;

      const rects = new Map<Stage, DOMRect>();
      sections.forEach((el, s) => rects.set(s, el.getBoundingClientRect()));
      // Look ahead, so a formation gathers as its section arrives.
      const eye = H * 0.7;
      let stage: Stage = "contact";
      for (const s of STAGES) {
        const r = rects.get(s);
        if (r && r.top <= eye && r.bottom > eye) stage = s;
      }
      if ((rects.get("hero")?.top ?? 0) > eye) stage = "hero";

      const box = rects.get(stage === "contact" ? "logos" : stage);
      if (!box) return;
      // On a new formation every dot travels in; none may jump straight to a slot.
      if (stage !== lastStage) {
        for (const dot of dots) dot.flow = 0;
        lastStage = stage;
      }
      const navy = rects.get("sentence");
      const stepRects = stage === "tiers" ? steps.map((s) => s.getBoundingClientRect()) : [];

      const mapW = Math.min(box.width * 0.9, box.height * 0.82 * US_ASPECT, 1180);
      const mapH = mapW / US_ASPECT;
      const mapX = box.left + (box.width - mapW) / 2;
      const mapY = box.top + (box.height - mapH) / 2;

      ctx.clearRect(0, 0, W, H);
      const dark = new Path2D();
      const light = new Path2D();

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let tx: number;
        let ty: number;
        let r = size;

        if (stage === "sentence") {
          tx = mapX + dot.map[0] * mapW;
          ty = mapY + dot.map[1] * mapH;
        } else if (stage === "reel" || stage === "roles") {
          const team = teams[i % TEAMS];
          const spread = 9 + dot.c * 7;
          const angle = dot.a * 6.283 + (still ? 0 : time / (2600 + dot.d * 2600));
          tx = box.left + team[0] * box.width + Math.cos(angle) * spread;
          ty = box.top + 40 + team[1] * (box.height - 80) + Math.sin(angle) * spread;
        } else if (stage === "tiers" && stepRects.length === TIER_COUNT) {
          // Five streams falling into the tier columns.
          const step = stepRects[i % TIER_COUNT];
          const fall = still ? dot.b : (dot.b + time * 0.00003 * (0.6 + dot.c)) % 1;
          tx = step.left + 10 + dot.a * (step.width - 20);
          ty = box.top + 20 + fall * (step.top - box.top - 26);
          r = size * Math.min(1, fall * 6, (1 - fall) * 6);
          if (fall < dot.flow) dot.y = ty;
          dot.flow = fall;
        } else if (stage === "logos" || stage === "contact") {
          // One stream narrowing toward the inquiry form below.
          const flow = still ? dot.b : (dot.b + time * 0.00004 * (0.5 + dot.c)) % 1;
          const half = 24 + (box.width / 2 - 24) * (1 - flow) ** 1.7;
          tx = box.left + box.width / 2 + (dot.a - 0.5) * 2 * half;
          ty = box.top + flow * box.height;
          // Dots fade in at the top and out at the bottom, so the stream has no hard edge.
          r = size * Math.min(1, flow * 6, (1 - flow) * 6);
          if (flow < dot.flow) {
            dot.x = tx;
            dot.y = ty;
          }
          dot.flow = flow;
        } else {
          const sway = still ? 0 : 26;
          tx = box.left + dot.a * box.width + Math.sin(time / 3200 + dot.c * 40) * sway;
          ty = box.top + dot.b * box.height + Math.cos(time / 3700 + dot.d * 40) * sway;
        }

        if (hover) {
          const dx = dot.x - pointerX;
          const dy = dot.y - pointerY;
          const near = Math.hypot(dx, dy);
          if (near < 120 && near > 0.01) {
            tx += (dx / near) * (120 - near) * 0.9;
            ty += (dy / near) * (120 - near) * 0.9;
          }
        }

        if (still) {
          dot.x = tx;
          dot.y = ty;
        } else {
          dot.y -= scrolled;
          const ease = 1 - Math.exp(-dt * (0.0022 + dot.c * 0.0034));
          dot.x += (tx - dot.x) * ease;
          dot.y += (ty - dot.y) * ease;
        }

        if (i === 0 || dot.y < -8 || dot.y > H + 8) continue;
        const path = navy && dot.y > navy.top && dot.y < navy.bottom ? light : dark;
        path.moveTo(dot.x + r, dot.y);
        path.arc(dot.x, dot.y, r, 0, 6.283);
      }

      ctx.fillStyle = "rgba(14, 20, 82, 0.2)";
      ctx.fill(dark);
      ctx.fillStyle = "rgba(190, 200, 255, 0.5)";
      ctx.fill(light);

      // The orange dot is Charlottesville on the map, and one of the crowd elsewhere.
      const home = dots[0];
      if (stage === "sentence") {
        const pulse = still ? 0.5 : (time / 1800) % 1;
        ctx.strokeStyle = `rgba(229, 114, 0, ${0.7 * (1 - pulse)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(home.x, home.y, 5 + pulse * 22, 0, 6.283);
        ctx.stroke();
      }
      ctx.fillStyle = "#e57200";
      ctx.beginPath();
      ctx.arc(home.x, home.y, stage === "sentence" ? 5 : 3.5, 0, 6.283);
      ctx.fill();

      if (!still) raf = requestAnimationFrame(frame);
    };

    // With reduced motion the crowd holds still and only redraws as the page moves.
    const redraw = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      resize();
      redraw();
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) redraw();
    };

    redraw();
    addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (still) addEventListener("scroll", redraw, { passive: true });
    if (hover && !still) {
      addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      removeEventListener("scroll", redraw);
      removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="crowd" aria-hidden="true" />;
}
