import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("states the headline once for assistive tech", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: "Meet the people building what's next." })).toBeInTheDocument();
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
});
