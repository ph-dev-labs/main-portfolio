import React from "react";
import { site } from "../data/site";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>
          © {year} {site.fullName}
        </span>
        <span>Designed & built by hand in React</span>
        <a href="#main" className="footer__top">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

export default Footer;
