import { describe, expect, it } from "vitest";
import { revealAt } from "./reveal";

describe("revealAt", () => {
  it("is hidden and lowered before the block reaches the screen", () => {
    expect(revealAt({ top: 1000, vh: 1000 })).toEqual({ opacity: 0, x: 0, y: 40 });
  });

  it("is fully in place once the block is well on screen", () => {
    expect(revealAt({ top: 300, vh: 1000 })).toEqual({ opacity: 1, x: 0, y: 0 });
  });

  it("slides in from the side it names", () => {
    expect(revealAt({ top: 1000, vh: 1000, from: "right" }).x).toBe(80);
    expect(revealAt({ top: 1000, vh: 1000, from: "left" }).x).toBe(-80);
  });

  it("lets later items in a group arrive a little after earlier ones", () => {
    const first = revealAt({ top: 700, vh: 1000, index: 0 });
    const third = revealAt({ top: 700, vh: 1000, index: 2 });
    expect(third.opacity).toBeLessThan(first.opacity);
  });
});
