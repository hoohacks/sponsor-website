import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("states the headline once for assistive tech", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: "The illimitable freedom of the human mind." })).toBeInTheDocument();
  });

  it("says what HooHacks is and links to packages and the form", () => {
    render(<Hero />);
    expect(
      screen.getByText("HooHacks is UVA's 24-hour hackathon. Sponsors meet students, mentor teams, run workshops, and award prizes."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Become a sponsor" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("link", { name: "See packages" })).toHaveAttribute("href", "#tiers");
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
});
