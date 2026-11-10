// Inquiry validation and submission. The limits match the `sponsorInquiries`
// create rule in HackX's firestore.rules, so anything that passes here
// passes the rule too.

export const LIMITS = { name: 120, email: 254, company: 160, message: 4000 } as const;

export interface InquiryInput {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Honeypot. Hidden from people; bots tend to fill it. */
  website: string;
}

export type InquiryValue = Omit<InquiryInput, "website">;
export type InquiryErrors = Partial<Record<keyof InquiryValue, string>>;

export type Validation =
  | { ok: true; value: InquiryValue }
  | { ok: false; errors: InquiryErrors; spam?: boolean };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(input: InquiryInput): Validation {
  if (input.website.trim() !== "") return { ok: false, errors: {}, spam: true };

  const value: InquiryValue = {
    name: input.name.trim(),
    email: input.email.trim(),
    company: input.company.trim(),
    message: input.message.trim(),
  };
  const errors: InquiryErrors = {};

  if (!value.name) errors.name = "Enter your name.";
  else if (value.name.length > LIMITS.name) errors.name = `Keep your name under ${LIMITS.name} characters.`;

  if (!value.email) errors.email = "Enter your work email.";
  else if (value.email.length > LIMITS.email || !EMAIL.test(value.email)) errors.email = "Enter a valid email, like name@company.com.";

  if (!value.company) errors.company = "Enter your company.";
  else if (value.company.length > LIMITS.company) errors.company = `Keep the company name under ${LIMITS.company} characters.`;

  if (value.message.length > LIMITS.message) errors.message = `Keep your message under ${LIMITS.message.toLocaleString("en-US")} characters.`;

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

/** Writes the inquiry to the current season's HackX Firestore. */
export async function submitInquiry(value: InquiryValue): Promise<void> {
  const [{ getDb }, { addDoc, collection, serverTimestamp }] = await Promise.all([
    import("./firebase"),
    import("firebase/firestore/lite"),
  ]);
  await addDoc(collection(getDb(), "sponsorInquiries"), {
    ...value,
    source: "sponsor-site",
    createdAt: serverTimestamp(),
  });
}
