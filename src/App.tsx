import { useState } from "react";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Roles } from "./components/Roles";
import { StatsLine } from "./components/StatsLine";
import { StickyCta } from "./components/StickyCta";
import { Tiers } from "./components/Tiers";
import { Weekend } from "./components/Weekend";
import { useReveals } from "./lib/reveal";

export function App() {
  const [interest, setInterest] = useState<string | null>(null);
  useReveals();

  return (
    <>
      <a className="visually-hidden" href="#contact">
        Skip to the sponsor inquiry form
      </a>
      <main>
        <Hero />
        <StatsLine />
        <Weekend />
        <Roles />
        <Tiers onAsk={setInterest} />
        <Logos />
        <Contact interest={interest} />
      </main>
      <StickyCta />
    </>
  );
}
