import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("has no top navigation and keeps the sections in order", () => {
    const { container } = render(<App />);
    expect(screen.queryByRole("navigation", { name: "Sections" })).toBeNull();
    expect([...container.querySelectorAll("main > section")].map((s) => s.id)).toEqual([
      "hero",
      "stats",
      "weekend",
      "roles",
      "tiers",
      "sponsors",
      "contact",
    ]);
  });
});
