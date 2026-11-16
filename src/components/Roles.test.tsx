import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Roles } from "./Roles";

describe("Roles", () => {
  it("names the three ways and who can use them", () => {
    render(<Roles />);
    expect(screen.getByRole("heading", { level: 2, name: "Ways to get involved." })).toBeInTheDocument();
    expect(
      screen.getByText("Every package includes sending mentors and judges. Higher tiers add more ways to take part."),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Run a workshop" })).toBeInTheDocument();
    expect(screen.getByText("Platinum and up")).toBeInTheDocument();
  });
});
