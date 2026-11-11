import { useState } from "react";
import { Contact } from "./components/Contact";
import { Crowd } from "./components/Crowd";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Nav } from "./components/Nav";
import { Roles } from "./components/Roles";
import { StatsSentence } from "./components/StatsSentence";
import { Tiers } from "./components/Tiers";
import { Weekend } from "./components/Weekend";
import { useScrollReveal } from "./lib/reveal";

export function App() {
  const [interest, setInterest] = useState<string | null>(null);
  useScrollReveal();

  return (
    <>
      <a className="visually-hidden" href="#contact">
        Skip to the sponsor inquiry form
      </a>
      <Crowd />
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
      <Footer />
    </>
  );
}
