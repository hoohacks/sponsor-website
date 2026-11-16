import { useEffect, useState } from "react";

/** Shown once the hero is mostly gone, hidden again when the form is in view. */
function shouldShow() {
  const hero = document.getElementById("hero")?.getBoundingClientRect();
  const contact = document.getElementById("contact")?.getBoundingClientRect();
  if (!hero || !contact) return false;
  const vh = innerHeight;
  return hero.bottom < vh * 0.35 && contact.top > vh * 0.8;
}

/**
 * The two sponsor actions, pinned to the bottom of the screen while you read,
 * so they're never more than a click away. Not a scroll animation: it runs
 * with reduced motion too, it just doesn't slide.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setShow(shouldShow());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="sticky-cta" aria-label="Sponsor HooHacks" data-show={show || undefined} inert={!show}>
      <a className="btn btn--ghost" href="#tiers">
        See packages
      </a>
      <a className="btn" href="#contact">
        Become a sponsor
      </a>
    </nav>
  );
}
