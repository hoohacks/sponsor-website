import { event } from "../content";
import { InquiryForm } from "./InquiryForm";

/** The inquiry form, in morning light at the end of the page. */
export function Contact({ interest }: { interest: string | null }) {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__grid">
        <div data-rise="left">
          <h2 id="contact-title">Get in touch.</h2>
          <p className="sub contact__lede">
            Tell us about your company and what you're interested in. The sponsorship team will reply by email.
          </p>
          <p className="contact__meta">
            Prefer email? <a href={`mailto:${event.email}`}>{event.email}</a>
            <br />
            Want the details offline? <a href={event.packetUrl}>Download the sponsorship packet (PDF)</a>
          </p>
        </div>
        <div data-rise="right" data-i="1">
          <InquiryForm interest={interest} />
        </div>
      </div>
    </section>
  );
}
