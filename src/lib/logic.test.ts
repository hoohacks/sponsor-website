import { describe, expect, it } from "vitest";
import { benefits, tiers } from "../content";
import { formatPrice, formatPriceShort, logoSize } from "./format";
import { benefitsForTier } from "./tiers";
import { LIMITS, validateInquiry } from "./inquiry";

describe("formatPrice", () => {
  it("formats whole dollars with separators", () => {
    expect(formatPrice(15000)).toBe("$15,000");
    expect(formatPrice(1000)).toBe("$1,000");
  });
});

describe("formatPriceShort", () => {
  it("shortens round thousands and keeps odd amounts exact", () => {
    expect(formatPriceShort(15000)).toBe("$15K");
    expect(formatPriceShort(2500)).toBe("$2.5K");
    expect(formatPriceShort(750)).toBe("$750");
    expect(formatPriceShort(1250)).toBe("$1,250");
  });
});

describe("logoSize", () => {
  it("gives wide and square logos the same visual area", () => {
    const wide = logoSize(5, { area: 3000, maxH: 100, maxW: 1000 });
    const square = logoSize(1, { area: 3000, maxH: 100, maxW: 1000 });
    const ratio = (wide.w * wide.h) / (square.w * square.h);
    expect(Math.abs(1 - ratio)).toBeLessThan(0.05);
    expect(wide.w).toBeGreaterThan(square.w);
  });

  it("respects the max height and width", () => {
    expect(logoSize(0.5, { area: 9000, maxH: 50, maxW: 200 }).h).toBe(50);
    expect(logoSize(10, { area: 9000, maxH: 50, maxW: 200 }).w).toBe(200);
  });
});

describe("benefitsForTier", () => {
  it("includes more benefits at every tier", () => {
    const counts = tiers.map((_, i) => benefitsForTier(benefits, i).length);
    counts.slice(1).forEach((n, i) => expect(n).toBeGreaterThan(counts[i]));
  });

  it("includes every benefit at Diamond", () => {
    const total = benefits.flatMap((g) => g.benefits).length;
    expect(benefitsForTier(benefits, 4)).toHaveLength(total);
  });

  it("marks benefits that are new or upgraded at the tier", () => {
    const gold = benefitsForTier(benefits, 2);
    expect(gold.find((b) => b.label === "Resume book")).toMatchObject({ change: "new", detail: "After the event" });
    expect(gold.find((b) => b.label === "Logo on the website")?.change).toBeNull();
    const platinum = benefitsForTier(benefits, 3);
    expect(platinum.find((b) => b.label === "Resume book")).toMatchObject({ change: "upgraded", detail: "Early access" });
  });

  it("marks nothing as new at Bronze", () => {
    expect(benefitsForTier(benefits, 0).every((b) => b.change === null)).toBe(true);
  });
});

describe("validateInquiry", () => {
  const ok = { name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines", message: "", website: "" };

  it("accepts a valid inquiry and trims it", () => {
    const r = validateInquiry({ ...ok, name: "  Ada Lovelace  ", message: "  Hi  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toEqual({ name: "Ada Lovelace", email: "ada@example.com", company: "Analytical Engines", message: "Hi" });
  });

  it("requires name, email, and company", () => {
    const r = validateInquiry({ ...ok, name: " ", email: "", company: "" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["company", "email", "name"]);
  });

  it("rejects a malformed email", () => {
    const r = validateInquiry({ ...ok, email: "ada@" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toMatch(/email/i);
  });

  it("rejects fields over the Firestore rule limits", () => {
    const r = validateInquiry({ ...ok, message: "x".repeat(LIMITS.message + 1) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeDefined();
  });

  it("flags a filled honeypot as spam", () => {
    const r = validateInquiry({ ...ok, website: "http://spam.example" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.spam).toBe(true);
  });
});
