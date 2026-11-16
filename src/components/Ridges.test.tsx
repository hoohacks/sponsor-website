import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Ridges } from "./Ridges";

const box = (top: number, height: number) => ({ top, height, bottom: top + height, left: 0, right: 1000, width: 1000, x: 0, y: top, toJSON() {} }) as DOMRect;

describe("Ridges", () => {
  afterEach(() => vi.restoreAllMocks());

  it("drifts with the element it's told to follow, not the whole section", async () => {
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1000);
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(300);
    const { container } = render(
      <section>
        <div className="track">
          <Ridges seed={1} layers={3} drift="x" follow=".track" />
        </div>
        <div style={{ height: 5000 }} />
      </section>,
    );
    const section = container.querySelector("section")!;
    const track = container.querySelector<HTMLElement>(".track")!;
    // Halfway through the pinned track, but barely into the taller section.
    vi.spyOn(track, "getBoundingClientRect").mockReturnValue(box(-1000, 2000 + innerHeight));
    vi.spyOn(section, "getBoundingClientRect").mockReturnValue(box(-1000, 20000));
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(r));
    });
    const first = container.querySelector<SVGPathElement>("path")!;
    const shift = Number(first.style.transform.match(/translateX\((-?[\d.]+)px\)/)![1]);
    // p = 0.5 through the track: the back ridge moves about half its full drift.
    expect(shift).toBeCloseTo(-0.5 * innerWidth * (0.22 + 0.02 / 3), 0);
  });
});
