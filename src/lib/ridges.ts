/* Blue Ridge ridgelines: layered profiles of the mountains you can see from
   Charlottesville. Back ridges sit higher and taller; each ridge stays below the
   one behind it, so the lines nest instead of crossing. */

interface RidgeOptions {
  width: number;
  height: number;
  layers: number;
  seed: number;
  /** Horizontal distance between points, in pixels. */
  step?: number;
}

/** The y of every point on every ridge, back to front. Lines run 30% past `width` so they can drift. */
export function ridgeLines({ width, height: h, layers, seed, step = 12 }: RidgeOptions): number[][] {
  let s = seed;
  const random = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const span = Math.round(width * 1.3);
  const lines: number[][] = [];
  for (let i = 0; i < layers; i++) {
    const base = h * (0.3 + (0.62 * i) / Math.max(1, layers - 1));
    const tall = h * 0.15 * (1 - i * 0.09);
    // Hills keep a real-world size: a phone sees a slice of gentle ridges, not squeezed ones.
    const wave = (turns: number) => [(turns * 2 * Math.PI) / Math.max(span, 1400), random() * 6.28] as const;
    const [f1, p1] = wave(1.2 + random() * 1.1);
    const [f2, p2] = wave(3.5 + random() * 2);
    const [f3, p3] = wave(10 + random() * 6);
    const prev = lines[i - 1];
    const ys: number[] = [];
    for (let x = 0, k = 0; x <= span; x += step, k++) {
      // A rounded main ridge with smaller shoulders and a little texture.
      let y = base - tall * Math.pow(0.5 + 0.5 * Math.sin(x * f1 + p1), 1.6) - h * 0.035 * Math.sin(x * f2 + p2) - h * 0.01 * Math.sin(x * f3 + p3);
      if (prev) y = Math.max(y, prev[k] + h * 0.022);
      ys.push(y);
    }
    // Make sure the line covers the full span even when step doesn't divide it.
    if ((ys.length - 1) * step < span) ys.push(ys[ys.length - 1]);
    lines.push(ys);
  }
  return lines;
}

/** One ridge as an SVG path. */
export const toPath = (ys: number[], step = 12) =>
  ys.map((y, k) => `${k ? "L" : "M"}${k * step} ${Number(y.toFixed(1))}`).join("");
