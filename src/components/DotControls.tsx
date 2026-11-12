import { useState } from "react";
import type { DotInteractionMode } from "./Crowd";

interface Props {
  mode: DotInteractionMode;
  onChange: (mode: DotInteractionMode) => void;
}

const MODES: { id: DotInteractionMode; label: string; desc: string; icon: string }[] = [
  {
    id: "spotlight",
    label: "Spotlight Glow",
    desc: "Recommended: nearby dots illuminate like stars while preserving the US map.",
    icon: "✨",
  },
  {
    id: "calm",
    label: "Calm (No Reactivity)",
    desc: "Dots stay serene in formation; no mouse repulsion, zero reading distraction.",
    icon: "🍃",
  },
  {
    id: "soft",
    label: "Soft Breeze",
    desc: "A gentle, cushioned drift that keeps formations and Charlottesville intact.",
    icon: "🌊",
  },
  {
    id: "push",
    label: "Original Push",
    desc: "The original 120px repulsive blast for direct comparison.",
    icon: "💨",
  },
];

export function DotControls({ mode, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const active = MODES.find((m) => m.id === mode) ?? MODES[0];

  return (
    <aside className="dot-controls" aria-label="Dot background interaction experimenter">
      {open ? (
        <div className="dot-controls__panel">
          <div className="dot-controls__head">
            <span className="dot-controls__title">
              <span aria-hidden="true">✨</span> Background Dot Behavior
            </span>
            <button
              type="button"
              className="dot-controls__close"
              onClick={() => setOpen(false)}
              aria-label="Close dot experimenter"
            >
              ✕
            </button>
          </div>
          <p className="dot-controls__lede">
            Test how the 760 attendee dots react to your cursor across the site:
          </p>
          <div className="dot-controls__options" role="radiogroup" aria-label="Dot interaction mode">
            {MODES.map((m) => {
              const selected = m.id === mode;
              return (
                <button
                  type="button"
                  key={m.id}
                  className="dot-controls__btn"
                  data-selected={selected || undefined}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onChange(m.id)}
                >
                  <span className="dot-controls__btn-top">
                    <span className="dot-controls__icon" aria-hidden="true">
                      {m.icon}
                    </span>
                    <strong className="dot-controls__label">{m.label}</strong>
                    {m.id === "spotlight" && <span className="dot-controls__rec">Recommended</span>}
                  </span>
                  <span className="dot-controls__desc">{m.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="dot-controls__trigger"
          onClick={() => setOpen(true)}
          aria-label={`Dot reaction experimenter: ${active.label}. Click to switch modes.`}
        >
          <span className="dot-controls__trigger-icon" aria-hidden="true">
            {active.icon}
          </span>
          <span className="dot-controls__trigger-label">
            Dots: <strong>{active.label}</strong>
          </span>
          <span className="dot-controls__trigger-badge">Test modes</span>
        </button>
      )}
    </aside>
  );
}
