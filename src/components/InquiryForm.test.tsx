import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const submitInquiry = vi.fn();
// Plain flag (not a vi.fn rejection) so the failure stays inside the form's try/catch.
let failNext = false;
vi.mock("../lib/inquiry", async (orig) => ({
  ...(await orig<typeof import("../lib/inquiry")>()),
  submitInquiry: async (...args: unknown[]) => {
    if (failNext) throw new Error("offline");
    return submitInquiry(...args);
  },
}));

import { InquiryForm } from "./InquiryForm";

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Work email"), "ada@example.com");
  await user.type(screen.getByLabelText("Company"), "Analytical Engines");
}

describe("InquiryForm", () => {
  beforeEach(() => {
    submitInquiry.mockReset();
    failNext = false;
  });

  it("shows field errors and doesn't submit an empty form", async () => {
    const user = userEvent.setup();
    render(<InquiryForm interest={null} />);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByText("Enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Enter your work email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your company.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveFocus();
    expect(submitInquiry).not.toHaveBeenCalled();
  });

  it("sends a valid inquiry and confirms it", async () => {
    submitInquiry.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<InquiryForm interest={null} />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(submitInquiry).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engines",
      message: "",
    });
    expect(await screen.findByRole("heading", { name: "Message sent." })).toHaveFocus();
  });

  it("keeps what was typed and offers the email when sending fails", async () => {
    failNext = true;
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<InquiryForm interest={null} />);
    await fill(user);
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/didn't send/i);
    expect(screen.getByRole("link", { name: "team@hoohacks.io" })).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toHaveValue("Analytical Engines");
    expect(logged).toHaveBeenCalled();
    logged.mockRestore();
  });

  it("quietly drops submissions that fill the hidden field", async () => {
    const user = userEvent.setup();
    const { container } = render(<InquiryForm interest={null} />);
    await fill(user);
    await user.type(container.querySelector<HTMLInputElement>('input[name="website"]')!, "spam");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("heading", { name: "Message sent." })).toBeInTheDocument();
    expect(submitInquiry).not.toHaveBeenCalled();
  });

  it("mentions the tier someone asked about", () => {
    render(<InquiryForm interest="Gold" />);
    expect(screen.getByLabelText(/Questions, comments, or concerns/)).toHaveValue("We're interested in the Gold tier.");
  });
});
