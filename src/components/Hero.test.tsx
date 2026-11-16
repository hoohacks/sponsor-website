import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("states the headline once for assistive tech", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: "The illimitable freedom of the human mind." })).toBeInTheDocument();
  });

  it("says what HooHacks is, leaving the sponsor buttons to the sticky block", () => {
    render(<Hero />);
    expect(
      screen.getByText("HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes."),
    ).toBeInTheDocument();
    // The sponsor buttons live in the sticky block, not in the hero.
    expect(screen.queryByRole("link", { name: "Become a sponsor" })).toBeNull();
    expect(screen.queryByRole("link", { name: "See packages" })).toBeNull();
  });

  it("shows when and where", () => {
    render(<Hero />);
    expect(screen.getByText("March 2027, University of Virginia")).toBeInTheDocument();
  });

  it("splits the headline into words so they can rise in when the page opens", () => {
    const { container } = render(<Hero />);
    const words = "The illimitable freedom of the human mind.".split(" ").length;
    expect(container.querySelectorAll(".hero__outline .hero__mask > .hero__word")).toHaveLength(words);
    expect(container.querySelectorAll(".hero__solid .hero__mask > .hero__word")).toHaveLength(words);
  });

  it("waits for the hall photo before playing the opening", () => {
    const { container } = render(<Hero />);
    const hero = container.querySelector("#hero")!;
    expect(hero).not.toHaveClass("hero--ready");
    fireEvent.load(screen.getByAltText("Hackers filling the lecture hall for the opening ceremony"));
    expect(hero).toHaveClass("hero--ready");
  });

  it("plays the opening anyway if the photo is slow", () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(container.querySelector("#hero")).toHaveClass("hero--ready");
    vi.useRealTimers();
  });

  it("credits the quote to Jefferson", () => {
    render(<Hero />);
    expect(screen.getByText("Thomas Jefferson")).toBeInTheDocument();
  });

  it("shows the sponsor line and links from the start, without waiting for a scroll", async () => {
    const { container } = render(<Hero />);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(r));
    });
    const row = container.querySelector<HTMLElement>(".hero__row")!;
    expect(row.style.opacity).toBe("");
    expect(row.style.transform).toBe("");
  });

  it("doesn't tie the headline fill or the photo's color to scrolling", async () => {
    const { container } = render(<Hero />);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(r));
    });
    expect(container.querySelector<HTMLElement>(".hero__solid")!.style.clipPath).toBe("");
    expect(container.querySelector<HTMLElement>(".hero__photo")!.style.transform).toBe("");
    expect(container.querySelector<HTMLElement>(".hero__photo")!.style.getPropertyValue("--color")).toBe("");
  });
});
