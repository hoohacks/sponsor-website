import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { sponsors } from "../content";
import { Logos } from "./Logos";

describe("Logos", () => {
  it("lists every past sponsor once for assistive tech", () => {
    render(<Logos />);
    expect(screen.getAllByRole("img").filter((i) => i.getAttribute("alt"))).toHaveLength(sponsors.length);
  });

  it("names the section", () => {
    render(<Logos />);
    expect(screen.getByRole("heading", { level: 2, name: "Past sponsors and partners." })).toBeInTheDocument();
  });
});
