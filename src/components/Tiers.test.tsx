import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { REDUCED, SHORT } from "../lib/scroll";
import { Tiers } from "./Tiers";

describe("Tiers", () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
    vi.restoreAllMocks();
  });

  it("shows only what each tier adds, plus the tier below", () => {
    render(<Tiers onAsk={() => {}} />);
    const gold = screen.getByRole("article", { name: "Gold" });
    expect(within(gold).getByText("$5,000")).toBeInTheDocument();
    expect(within(gold).getByText("Resume book")).toBeInTheDocument();
    expect(within(gold).queryByText("Sponsor lounge")).toBeNull();
    expect(within(gold).getByText("Plus everything in Silver.")).toBeInTheDocument();
  });

  it("keeps the full comparison and the add-ons", () => {
    render(<Tiers onAsk={() => {}} />);
    expect(screen.getByText("Compare every tier")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "À la carte" })).toBeInTheDocument();
  });

  it("stacks the tiers under reduced motion", () => {
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q === REDUCED })) as typeof window.matchMedia;
    const { container } = render(<Tiers onAsk={() => {}} />);
    expect(container.querySelector(".tiers--stacked")).not.toBeNull();
  });

  it("stacks the tiers on a short screen, like a phone on its side", () => {
    window.matchMedia = ((q: string) => ({ ...original(q), matches: q === SHORT })) as typeof window.matchMedia;
    const { container } = render(<Tiers onAsk={() => {}} />);
    expect(container.querySelector(".tiers--stacked")).not.toBeNull();
  });

  it("brings a tier into view when its button gets keyboard focus", () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<Tiers onAsk={() => {}} />);
    screen.getByRole("link", { name: "Ask about Diamond" }).focus();
    expect(scroll).toHaveBeenCalled();
  });

  it("goes straight to the form when Ask is clicked, without scrolling to the tier first", async () => {
    const scroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    render(<Tiers onAsk={() => {}} />);
    await userEvent.click(screen.getByRole("link", { name: "Ask about Diamond" }));
    expect(scroll).not.toHaveBeenCalled();
  });
});

describe("Tiers rendering", () => {
  it("doesn't redraw the comparison table or price list when the active tier changes", async () => {
    const { Compare } = await import("./Compare");
    const { AddOns } = await import("./AddOns");
    expect((Compare as unknown as { $$typeof: symbol }).$$typeof).toBe(Symbol.for("react.memo"));
    expect((AddOns as unknown as { $$typeof: symbol }).$$typeof).toBe(Symbol.for("react.memo"));
  });
});
