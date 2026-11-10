import { event } from "../content";
import { InquiryForm } from "./InquiryForm";
import { Photo } from "./Photo";

export function Contact({ interest }: { interest: string | null }) {
  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__box">
        <div className="contact__pic">
          <Photo name="crowd-smiles" alt="HooHacks hackers smiling in the audience" sizes="(max-width: 1000px) 100vw, 50vw" />
          <div className="contact__pic-copy">
            <h2 id="contact-title">Come build with us.</h2>
            <p>Tell us about your company and what you'd like from the weekend. The sponsorship team will reply by email.</p>
          </div>
        </div>
        <div className="contact__form">
          <InquiryForm interest={interest} />
          <p className="contact__meta">
            Prefer email? <a href={`mailto:${event.email}`}>{event.email}</a>
            <br />
            Want the details offline? <a href={event.packetUrl}>Download the sponsorship packet (PDF)</a>
          </p>
        </div>
      </div>
    </section>
  );
}
