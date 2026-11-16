import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StickyCta } from "./StickyCta";

const rect = (top: number, height: number) =>
  ({ top, bottom: top + height, height, left: 0, right: 1000, width: 1000, x: 0, y: top, toJSON() {} }) as DOMRect;

/** A page with a hero and a contact section, placed at the given screen positions. */
function setup(heroTop: number, contactTop: number) {
  document.body.innerHTML = `<section id="hero"></section><section id="contact"></section>`;
  vi.spyOn(document.getElementById("hero")!, "getBoundingClientRect").mockReturnValue(rect(heroTop, 2000));
  vi.spyOn(document.getElementById("contact")!, "getBoundingClientRect").mockReturnValue(rect(contactTop, 900));
  return render(<StickyCta />, { container: document.body.appendChild(document.createElement("div")) });
}

const scroll = async () =>
  act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((r) => requestAnimationFrame(r));
  });

describe("StickyCta", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("links to the inquiry form and the packages", () => {
    setup(0, 9000);
    expect(screen.getByRole("link", { name: "Become a sponsor", hidden: true })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "See packages", hidden: true })).toHaveAttribute("href", "#tiers");
  });

  it("stays hidden, and out of the tab order, while the hero is on screen", async () => {
    const { container } = setup(-200, 9000);
    await scroll();
    const bar = container.querySelector(".sticky-cta")!;
    expect(bar).not.toHaveAttribute("data-show");
    expect(bar).toHaveAttribute("inert");
  });

  it("appears once the hero has scrolled away", async () => {
    const { container } = setup(-1950, 9000);
    await scroll();
    const bar = container.querySelector(".sticky-cta")!;
    expect(bar).toHaveAttribute("data-show");
    expect(bar).not.toHaveAttribute("inert");
  });

  it("gets out of the way when the contact form is on screen", async () => {
    const { container } = setup(-9000, 200);
    await scroll();
    expect(container.querySelector(".sticky-cta")).not.toHaveAttribute("data-show");
  });
});
