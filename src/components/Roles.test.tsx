import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PHONE, REDUCED, SHORT } from "../lib/scroll";
import { Roles } from "./Roles";

describe("Roles", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });
  const matching = (query: string) => {
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q === query })) as typeof window.matchMedia;
  };

  it("names the three ways and who can use them", () => {
    render(<Roles />);
    expect(screen.getByRole("heading", { level: 2, name: "Ways to get involved." })).toBeInTheDocument();
    expect(
      screen.getByText("Every package includes sending mentors and judges. Higher tiers add more ways to take part."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Run a workshop" })).toBeInTheDocument();
    expect(screen.getByText("Platinum and up")).toBeInTheDocument();
  });

  it("pins the photos as a full-screen triptych on wide screens", () => {
    const { container } = render(<Roles />);
    expect(container.querySelector(".roles--pinned")).not.toBeNull();
    expect(container.querySelectorAll(".roles__slat")).toHaveLength(3);
  });

  it("shows plain stacked columns on phones", () => {
    matching(PHONE);
    const { container } = render(<Roles />);
    expect(container.querySelector(".roles--pinned")).toBeNull();
    expect(container.querySelectorAll(".role__photo")).toHaveLength(3);
  });

  it("shows plain columns under reduced motion", () => {
    matching(REDUCED);
    const { container } = render(<Roles />);
    expect(container.querySelector(".roles--pinned")).toBeNull();
  });

  it("shows plain columns on a short screen, like a phone on its side", () => {
    matching(SHORT);
    const { container } = render(<Roles />);
    expect(container.querySelector(".roles--pinned")).toBeNull();
  });
});

describe("Roles triptych images", () => {
  it("asks for photos big enough to stay sharp at full screen", () => {
    const { container } = render(<Roles />);
    for (const img of container.querySelectorAll(".roles__slat img")) expect(img.getAttribute("sizes")).toBe("110vw");
  });
});
