import { describe, expect, it } from "vitest";
import { insetBetween, layerAround, photoScale, rolesScene } from "./triptych";

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

describe("layerAround", () => {
  const third = { left: 0, top: 0, width: 480, height: 900 };
  const card = { left: 118, top: 300, width: 379, height: 400 };
  const box = layerAround(third, card);
  const center = (r: { left: number; top: number; width: number; height: number }) => [r.left + r.width / 2, r.top + r.height / 2];

  it("centers the photo on its final frame, so the frame shows the middle of the photo", () => {
    expect(center(box)).toEqual(center(card));
  });

  it("still covers the whole third, so the full-screen start has no gaps", () => {
    expect(box.left).toBeLessThanOrEqual(third.left);
    expect(box.top).toBeLessThanOrEqual(third.top);
    expect(box.left + box.width).toBeGreaterThanOrEqual(third.left + third.width);
    expect(box.top + box.height).toBeGreaterThanOrEqual(third.top + third.height);
  });
});

describe("photoScale", () => {
  // A 1600x1200 photo in a 615x1000 layer centered on a 379x396 frame.
  const box = { left: 0, top: 0, width: 615, height: 1000 };
  const card = { left: 118, top: 302, width: 379, height: 396 };
  const third = { left: 0, top: 50, width: 480, height: 900 };
  const nat = { width: 1600, height: 1200 };
  const cover = (r: { width: number; height: number }) => Math.max(r.width / nat.width, r.height / nat.height);

  it("is full size while the photos fill the screen", () => {
    expect(photoScale(box, third, card, nat, 0)).toBeGreaterThanOrEqual(1);
  });

  it("ends with the whole frame filled by the photo, not a zoomed-in slice", () => {
    expect(photoScale(box, third, card, nat, 1)).toBeCloseTo(cover(card) / cover(box), 3);
  });

  it("never leaves a gap in what's showing on the way", () => {
    for (let k = 0; k <= 1; k += 0.05) {
      const s = photoScale(box, third, card, nat, k) * cover(box);
      const halfW = (nat.width * s) / 2;
      const halfH = (nat.height * s) / 2;
      const cx = card.left + card.width / 2;
      const cy = card.top + card.height / 2;
      const left = third.left + (card.left - third.left) * k;
      const top = third.top + (card.top - third.top) * k;
      const right = third.left + third.width + (card.left + card.width - third.left - third.width) * k;
      const bottom = third.top + third.height + (card.top + card.height - third.top - third.height) * k;
      expect(cx - halfW).toBeLessThanOrEqual(left + 0.01);
      expect(cx + halfW).toBeGreaterThanOrEqual(right - 0.01);
      expect(cy - halfH).toBeLessThanOrEqual(top + 0.01);
      expect(cy + halfH).toBeGreaterThanOrEqual(bottom - 0.01);
    }
  });
});
