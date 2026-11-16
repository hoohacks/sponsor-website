import { act, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ridgeLines, toPath } from "./ridges";
import { enterProgress, pinProgress, railDistance, REDUCED, throughProgress, useScrollFrame } from "./scroll";

describe("scroll progress", () => {
  it("pin progress runs 0 to 1 across the extra height", () => {
    expect(pinProgress({ top: 0, height: 3000 }, 1000)).toBe(0);
    expect(pinProgress({ top: -1000, height: 3000 }, 1000)).toBe(0.5);
    expect(pinProgress({ top: -2500, height: 3000 }, 1000)).toBe(1);
  });

  it("enter progress finishes when the top is halfway up", () => {
    expect(enterProgress({ top: 1000 }, 1000)).toBe(0);
    expect(enterProgress({ top: 750 }, 1000)).toBe(0.5);
    expect(enterProgress({ top: 500 }, 1000)).toBe(1);
  });

  it("through progress spans entering at the bottom to leaving at the top", () => {
    expect(throughProgress({ top: 1000, height: 1000 }, 1000)).toBe(0);
    expect(throughProgress({ top: 0, height: 1000 }, 1000)).toBe(0.5);
    expect(throughProgress({ top: -1000, height: 1000 }, 1000)).toBe(1);
  });
});

describe("ridges", () => {
  it("nest: every layer stays below the one behind it", () => {
    const lines = ridgeLines({ width: 1200, height: 400, layers: 6, seed: 11 });
    expect(lines).toHaveLength(6);
    for (let i = 1; i < lines.length; i++)
      lines[i].forEach((y, k) => expect(y).toBeGreaterThanOrEqual(lines[i - 1][k] + 400 * 0.022 - 1e-9));
  });

  it("are the same for the same seed", () => {
    const a = ridgeLines({ width: 800, height: 300, layers: 4, seed: 3 });
    expect(a).toEqual(ridgeLines({ width: 800, height: 300, layers: 4, seed: 3 }));
  });

  it("reach past the right edge so they can drift", () => {
    const [first] = ridgeLines({ width: 1000, height: 300, layers: 3, seed: 5 });
    expect((first.length - 1) * 12).toBeGreaterThanOrEqual(1300);
  });

  it("stay smooth on a narrow phone screen", () => {
    const h = 400;
    for (const ys of ridgeLines({ width: 390, height: h, layers: 6, seed: 11 }))
      for (let k = 1; k < ys.length; k++) expect(Math.abs(ys[k] - ys[k - 1])).toBeLessThan(h * 0.02);
  });

  it("turn into an SVG path", () => {
    expect(toPath([10, 20.25, 30])).toBe("M0 10L12 20.3L24 30");
  });
});

describe("useScrollFrame", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  function Probe({ cb }: { cb: () => void }) {
    useScrollFrame(cb);
    return null;
  }

  it("runs on scroll", async () => {
    const cb = vi.fn();
    render(createElement(Probe, { cb }));
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(cb).toHaveBeenCalled();
  });

  it("never runs under reduced motion", async () => {
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q === REDUCED })) as typeof window.matchMedia;
    const cb = vi.fn();
    render(createElement(Probe, { cb }));
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(cb).not.toHaveBeenCalled();
  });
});

describe("railDistance", () => {
  it("stops with the last tier at the rail's starting edge", () => {
    // Rail starts 118px in; five 608px columns; the last one is 560px wide plus its right padding.
    const starts = [118, 726, 1334, 1942, 2550];
    expect(railDistance(starts, 118)).toBe(2550 - 118);
  });

  it("never travels backwards", () => {
    expect(railDistance([118], 118)).toBe(0);
  });
});
