import { useEffect, useState } from "react";

/** Shown everywhere except when the contact form, which has its own button, is in view. */
function shouldShow() {
  const contact = document.getElementById("contact")?.getBoundingClientRect();
  if (!contact) return true;
  return contact.top > innerHeight * 0.8;
}

/**
 * The two sponsor actions, pinned to the bottom of the screen from the moment
 * the site opens, so they're never more than a click away. The hero has no
 * buttons of its own; this block is the one place for them. Not a scroll animation: it runs
 * with reduced motion too, it just doesn't slide.
 */
export function StickyCta() {
  const [show, setShow] = useState(true);

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
