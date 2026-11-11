import type { ReactNode } from "react";
import { event, socials } from "../content";

const icons: Record<string, ReactNode> = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </>
  ),
  Facebook: (
    <path
      fill="currentColor"
      d="M13.6 21v-7.9h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.6V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H7.7v3.1h2.7V21z"
    />
  ),
  X: <path fill="currentColor" d="M17.6 3h3.1l-6.8 7.7L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.2 4.7H5.3z" />,
};

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#top" aria-label="HooHacks, back to top">
              <img src="/img/logo-long.svg" alt="HooHacks" width={159} height={22} loading="lazy" />
            </a>
            <p>The University of Virginia's 24-hour hackathon, run by students every spring.</p>
          </div>

          <nav className="footer__col" aria-label="Sponsoring">
            <h2>Sponsoring</h2>
            <a href="#overview">Overview</a>
            <a href="#tiers">Packages</a>
            <a href={event.packetUrl}>Sponsorship packet (PDF)</a>
            <a href="#contact">Get in touch</a>
          </nav>

          <nav className="footer__col" aria-label="HooHacks">
            <h2>HooHacks</h2>
            <a href={event.teamUrl} target="_blank" rel="noopener noreferrer">
              Meet the team
            </a>
            <a href={event.devpostUrl} target="_blank" rel="noopener noreferrer">
              2026 projects
            </a>
            <a href={`mailto:${event.email}`}>{event.email}</a>
          </nav>
        </div>

        <div className="footer__bottom">
          <span>HooHacks at the University of Virginia</span>
          <ul className="footer__socials">
            {socials.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`HooHacks on ${s.name}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    {icons[s.name]}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
