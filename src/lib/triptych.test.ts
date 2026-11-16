import { describe, expect, it } from "vitest";
import { insetBetween, rolesScene } from "./triptych";

describe("rolesScene", () => {
  it("starts as one full-screen triptych, with no words yet", () => {
    expect(rolesScene(0)).toEqual({ split: 0, color: 0, head: 0, text: [0, 0, 0] });
  });

  it("ends split into columns, in color, with all the words in", () => {
    expect(rolesScene(1)).toEqual({ split: 1, color: 1, head: 1, text: [1, 1, 1] });
  });

  it("splits the photos before the words arrive", () => {
    const mid = rolesScene(0.45);
    expect(mid.split).toBeGreaterThan(0.5);
    expect(mid.text[0]).toBe(0);
  });

  it("brings each column's words in after the one to its left", () => {
    const s = rolesScene(0.72);
    expect(s.text[0]).toBeGreaterThan(s.text[1]);
    expect(s.text[1]).toBeGreaterThan(s.text[2]);
  });
});

describe("insetBetween", () => {
  // A photo layer 500 wide, 900 tall. It starts as the left third of the screen
  // and ends as a framed card inside it.
  const box = { left: 0, top: 0, width: 500, height: 900 };
  const third = { left: 0, top: 0, width: 480, height: 900 };
  const card = { left: 118, top: 300, width: 379, height: 400 };

  it("shows the whole third at the start", () => {
    expect(insetBetween(box, third, card, 0)).toBe("inset(0px 20px 0px 0px round 0px)");
  });

  it("shows only the card at the end, with rounded corners", () => {
    expect(insetBetween(box, third, card, 1)).toBe("inset(300px 3px 200px 118px round 6px)");
  });
});
