import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Weekend } from "./Weekend";

describe("Weekend", () => {
  it("shows each moment with its day and time", () => {
    render(<Weekend />);
    expect(screen.getAllByRole("article")).toHaveLength(5);
    expect(screen.getByRole("heading", { name: "Judging" }).closest("article")).toHaveTextContent("Sunday1:30 PM");
  });

  it("describes each moment plainly", () => {
    render(<Weekend />);
    expect(screen.getByText("Each team presents its project to the judges.")).toBeInTheDocument();
  });
});
