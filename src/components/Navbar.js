import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { site } from "../data/site";

const links = [
  { to: "/project", label: "Work" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Résumé" },
];

function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
      <div className="wrap nav__inner">
        <Link to="/" className="nav__brand" aria-label={`${site.name}, home`}>
          <span className="nav__mark" aria-hidden="true">
            NC
          </span>
          <span className="nav__name">{site.name}</span>
        </Link>

        <button
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>

        <nav id="nav-menu" className="nav__menu" aria-label="Primary">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
          <a href="#contact" className="btn btn--solid btn--sm nav__cta" onClick={() => setOpen(false)}>
            Let's talk
          </a>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
