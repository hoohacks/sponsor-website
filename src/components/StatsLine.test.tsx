import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatsLine } from "./StatsLine";

describe("StatsLine", () => {
  it("lists every figure as plain text", () => {
    render(<StatsLine />);
    for (const t of ["760+ students", "46 schools", "18 states", "220+ projects", "29% women and non-binary", "15 sponsors", "7 partners"])
      expect(screen.getByText(t, { selector: ".visually-hidden li" })).toBeInTheDocument();
  });

  it("introduces the weekend", () => {
    render(<StatsLine />);
    expect(screen.getByRole("heading", { level: 2, name: "Twenty-four hours in Charlottesville." })).toBeInTheDocument();
  });
});
