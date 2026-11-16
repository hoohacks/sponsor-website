import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("pre-fills the message after Ask about Gold", async () => {
    render(<App />);
    await userEvent.click(screen.getByRole("link", { name: "Ask about Gold" }));
    expect(screen.getByLabelText(/Questions/)).toHaveValue("We're interested in the Gold tier.");
  });
});
