import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide while scrolling down, show again on any scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < 80) setHidden(false);
      else if (Math.abs(y - last) > 6) setHidden(y > last);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled} data-hidden={hidden} onFocusCapture={() => setHidden(false)}>
      <div className="wrap">
        <a className="nav__logo" href="#top" aria-label="HooHacks, back to top">
          <img src="/img/logo-long.svg" alt="HooHacks" width={159} height={22} />
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#overview">Overview</a>
          <a href="#tiers">Packages</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="btn btn--navy" href="#contact">
          Sponsor us
        </a>
      </div>
    </header>
  );
}
