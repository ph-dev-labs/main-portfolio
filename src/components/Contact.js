import React, { useState } from "react";
import { site, primaryContact } from "../data/site";

function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="eyebrow reveal">Contact</p>
        <h2 id="contact-title" className="contact__title reveal">
          Got a product to ship?
          <br />
          <em>Let's talk.</em>
        </h2>
        <div className="contact__lede reveal">
          <span className="avatar avatar--lg">
            <img src={site.photos.avatar} alt="" width="56" height="56" loading="lazy" />
          </span>
          <p>
            {site.availability}.
            <br />I usually reply within a day — you'll hear back from me, not a form.
          </p>
        </div>

        <div className="contact__actions reveal">
          <a
            className="btn btn--accent btn--lg"
            href={primaryContact.href}
            {...(primaryContact.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {primaryContact.label} <span aria-hidden="true">→</span>
          </a>
          {site.email && (
            <button className="btn btn--ghost btn--lg" onClick={copyEmail} aria-live="polite">
              {copied ? "Copied ✓" : "Copy email"}
            </button>
          )}
          <a className="btn btn--ghost btn--lg" href={site.resume} download={site.resumeFileName}>
            Download résumé
          </a>
        </div>

        <ul className="contact__socials reveal">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="link-arrow">
                {s.label} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Contact;
