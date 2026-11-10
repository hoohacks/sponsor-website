import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { event } from "../content";
import { LIMITS, submitInquiry, validateInquiry, type InquiryErrors, type InquiryInput } from "../lib/inquiry";

type Status = "idle" | "sending" | "sent" | "error";

const empty: InquiryInput = { name: "", email: "", company: "", message: "", website: "" };

interface Props {
  /** Tier name someone clicked "Ask about" on, used to pre-fill the message. */
  interest: string | null;
}

export function InquiryForm({ interest }: Props) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const sentHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();

  // Pre-fill the message when someone asks about a tier, unless they already wrote one.
  useEffect(() => {
    if (!interest) return;
    setValues((v) => {
      const auto = /^We're interested in the \w+ tier\.$/.test(v.message);
      return v.message === "" || auto ? { ...v, message: `We're interested in the ${interest} tier.` } : v;
    });
  }, [interest]);

  useEffect(() => {
    if (status === "sent") sentHeading.current?.focus();
  }, [status]);

  const set = (key: keyof InquiryInput) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (key in errors) setErrors(({ [key as keyof InquiryErrors]: _, ...rest }) => rest);
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;

    const result = validateInquiry(values);
    if (!result.ok) {
      if (result.spam) {
        setStatus("sent");
        return;
      }
      setErrors(result.errors);
      const first = (["name", "email", "company", "message"] as const).find((k) => result.errors[k]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitInquiry(result.value);
      setStatus("sent");
    } catch (err) {
      console.error("Sponsor inquiry failed to send", err);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form__sent" role="status">
        <h3 ref={sentHeading} tabIndex={-1}>
          Message sent.
        </h3>
        <p>Thanks for reaching out. The sponsorship team will reply to your email soon.</p>
      </div>
    );
  }

  const field = (key: "name" | "email" | "company", label: string, type: string, autoComplete: string) => (
    <div className="field" data-invalid={Boolean(errors[key])}>
      <label htmlFor={`${id}-${key}-input`}>{label}</label>
      <input
        id={`${id}-${key}-input`}
        name={key}
        type={type}
        autoComplete={autoComplete}
        value={values[key]}
        onChange={set(key)}
        maxLength={LIMITS[key]}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `${id}-${key}` : undefined}
        required
      />
      {errors[key] && (
        <span className="field__error" id={`${id}-${key}`}>
          {errors[key]}
        </span>
      )}
    </div>
  );

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="form__row">
        {field("name", "Name", "text", "name")}
        {field("email", "Work email", "email", "email")}
      </div>
      {field("company", "Company", "text", "organization")}
      <div className="field" data-invalid={Boolean(errors.message)}>
        <label htmlFor={`${id}-message-input`}>
          Questions, comments, or concerns <span className="field__opt">(optional)</span>
        </label>
        <textarea
          id={`${id}-message-input`}
          name="message"
          value={values.message}
          onChange={set("message")}
          maxLength={LIMITS.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message` : undefined}
        />
        {errors.message && (
          <span className="field__error" id={`${id}-message`}>
            {errors.message}
          </span>
        )}
      </div>

      <div className="form__honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>

      {status === "error" && (
        <p className="form__alert" role="alert">
          Your message didn't send. Check your connection and try again, or email us at{" "}
          <a href={`mailto:${event.email}`}>{event.email}</a>.
        </p>
      )}

      <div className="form__submit">
        <button className="btn" type="submit" disabled={status === "sending"} data-busy={status === "sending"}>
          <span className="btn__label">{status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Send message"}</span>
        </button>
      </div>
    </form>
  );
}
