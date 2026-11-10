import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="wrap">
        <a className="nav__logo" href="#top" aria-label="HooHacks, back to top">
          <img src="/img/logo-long.svg" alt="HooHacks" width={159} height={22} />
        </a>
        <nav className="nav__links" aria-label="Sections">
          <a href="#weekend">The weekend</a>
          <a href="#roles">How sponsors join</a>
          <a href="#tiers">Tiers</a>
        </nav>
        <a className="btn btn--navy" href="#contact">
          Become a sponsor
        </a>
      </div>
    </header>
  );
}
