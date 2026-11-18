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
    expect(screen.getByLabelText(/^Questions or comments/)).toHaveValue("We're interested in the Gold tier.");
  });

  it("invites sponsors to get in touch, plainly", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Get in touch." })).toBeInTheDocument();
    expect(
      screen.getByText("Tell us about your company and what you're interested in. The sponsorship team will reply by email."),
    ).toBeInTheDocument();
  });

  it("points every in-page link at something on the page", () => {
    const { container } = render(<App />);
    const targets = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')].map((a) => a.getAttribute("href")!.slice(1));
    for (const id of targets) expect(document.getElementById(id), `#${id}`).not.toBeNull();
  });

  it("brings new content in as it scrolls up, section by section", () => {
    const { container } = render(<App />);
    const rising = (sel: string) => container.querySelectorAll(`${sel} [data-rise]`).length;
    expect(rising("#weekend")).toBeGreaterThanOrEqual(10);
    // Ways to get involved runs its own pinned triptych on wide screens.
    expect(container.querySelectorAll("#roles .roles__slat")).toHaveLength(3);
    expect(rising("#tiers")).toBeGreaterThanOrEqual(7);
    expect(rising("#sponsors")).toBeGreaterThanOrEqual(1);
    expect(rising("#contact")).toBeGreaterThanOrEqual(2);
  });

  it("ends at the contact section, with no footer", () => {
    const { container } = render(<App />);
    expect(container.querySelector("footer")).toBeNull();
  });

  it("keeps the sponsor actions one click away from anywhere on the page", () => {
    render(<App />);
    expect(screen.getByRole("navigation", { name: "Sponsor HooHacks", hidden: true })).toBeInTheDocument();
  });

  it("doesn't offer the sponsorship packet anywhere", () => {
    const { container } = render(<App />);
    expect(container.textContent).not.toMatch(/packet/i);
    expect(container.querySelector('a[href$=".pdf"]')).toBeNull();
  });
});
