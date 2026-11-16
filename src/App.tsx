import { useState } from "react";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Roles } from "./components/Roles";
import { StatsLine } from "./components/StatsLine";
import { Tiers } from "./components/Tiers";
import { Weekend } from "./components/Weekend";

export function App() {
  const [interest, setInterest] = useState<string | null>(null);

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
      <Footer />
    </>
  );
}
