import { useState } from "react";
import { Contact } from "./components/Contact";
import { Crowd, type DotInteractionMode } from "./components/Crowd";
import { DotControls } from "./components/DotControls";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Logos } from "./components/Logos";
import { Nav } from "./components/Nav";
import { Roles } from "./components/Roles";
import { StatsSentence } from "./components/StatsSentence";
import { Tiers } from "./components/Tiers";
import { Weekend } from "./components/Weekend";
import { useScrollReveal } from "./lib/reveal";

const STORAGE_KEY = "hoohacks_dot_mode";

function getInitialDotMode(): DotInteractionMode {
  if (typeof window === "undefined") return "spotlight";
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as DotInteractionMode | null;
    if (saved && (saved === "spotlight" || saved === "calm" || saved === "soft" || saved === "push")) {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return "spotlight";
}

export function App() {
  const [interest, setInterest] = useState<string | null>(null);
  const [dotMode, setDotModeState] = useState<DotInteractionMode>(getInitialDotMode);
  useScrollReveal();

  const handleDotModeChange = (mode: DotInteractionMode) => {
    setDotModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <>
      <a className="visually-hidden" href="#contact">
        Skip to the sponsor inquiry form
      </a>
      <Crowd mode={dotMode} />
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
      <DotControls mode={dotMode} onChange={handleDotModeChange} />
    </>
  );
}
