import { useState } from "react";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Nav } from "./components/Nav";
import { Roles } from "./components/Roles";
import { StatsSentence } from "./components/StatsSentence";
import { Tiers } from "./components/Tiers";
import { Weekend } from "./components/Weekend";
import { event } from "./content";
import { useScrollReveal } from "./lib/reveal";

export function App() {
  const [interest, setInterest] = useState<string | null>(null);
  useScrollReveal();

  return (
    <>
      <a className="visually-hidden" href="#contact">
        Skip to the sponsor inquiry form
      </a>
      <Nav />
      <main>
        <Hero />
        <StatsSentence />
        <Weekend />
        <Roles />
        <Tiers onAsk={setInterest} />
        <Logos />
        <Contact interest={interest} />
      </main>
      <footer className="footer">
        <div className="wrap">
          <span>HooHacks at the University of Virginia</span>
          <a href={`mailto:${event.email}`}>{event.email}</a>
        </div>
      </footer>
    </>
  );
}
