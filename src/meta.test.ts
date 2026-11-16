import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Tests run from the project root.
const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");
const meta = (prop: string) => html.match(new RegExp(`(?:property|name)="${prop}" content="([^"]*)"`))?.[1];

describe("link previews", () => {
  it("lead with the hero quote, not the old headline", () => {
    expect(html).not.toMatch(/what's next/i);
    expect(meta("og:description")).toMatch(/^The illimitable freedom of the human mind\./);
  });

  it("describe the event plainly for search", () => {
    expect(meta("description")).toMatch(/UVA's 24-hour hackathon/);
  });
});

describe("hero opening", () => {
  // Line endings vary on Windows checkouts; compare on plain newlines.
  const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8").replace(/\r\n/g, "\n");
  const animated = [...css.matchAll(/\.(hero__[a-z]+)[^{]*\{[^}]*animation: hero-/g)].map((m) => m[1]);
  const paused = css.slice(css.indexOf("Held at the first frame"), css.indexOf("@keyframes hero-curtain"));
  const still = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce) {\n  .hero__photo .duo"));

  it("holds every animated part of the opening until the photo is ready", () => {
    for (const name of animated) expect(paused, name).toContain(`.${name}`);
  });

  it("switches every animated part of the opening off under reduced motion", () => {
    for (const name of animated) expect(still.slice(0, 400), name).toContain(`.${name}`);
  });

});

describe("fonts", () => {
  const css = readFileSync(resolve(process.cwd(), "src/styles/global.css"), "utf8");

  it("loads UVA's free brand substitutes, Libre Caslon and Libre Franklin", () => {
    expect(html).toMatch(/family=Libre\+Caslon\+Display/);
    expect(html).toMatch(/family=Libre\+Caslon\+Text/);
    expect(html).toMatch(/family=Libre\+Franklin/);
  });

  it("no longer uses the old fonts anywhere", () => {
    for (const old of ["Funnel", "Instrument"]) {
      expect(html).not.toContain(old);
      expect(css).not.toContain(old);
    }
  });

  it("doesn't hide the hero's sponsor line until a scroll", () => {
    const rule = css.match(/\n\.hero__row\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(rule).not.toMatch(/opacity:\s*0/);
  });
});
