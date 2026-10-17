import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import CaseStudy from "../Projects/CaseStudy";
import ProjectIndex from "../Projects/ProjectIndex";
import { featuredProjects, moreProjects, clients, projects } from "../../data/projects";
import { site, stats } from "../../data/site";
import Experience from "../Experience";

// three.js is code-split so it never blocks first paint
const HeroScene = lazy(() => import("./HeroScene"));

const capabilities = [
  "React",
  "Next.js",
  "React Native",
  "Expo",
  "TypeScript",
  "TanStack Query",
  "Tailwind",
  "Node.js",
  "Dashboards",
  "Payments",
  "Push notifications",
  "Booking flows",
];

const services = [
  {
    title: "Mobile apps",
    body: "React Native & Expo apps taken all the way to the store — builds, push notifications, deep links.",
    proof: "Zysk Group (Google Play)",
  },
  {
    title: "Storefronts & product sites",
    body: "Fast, search-friendly sites that turn visitors into enquiries and orders.",
    proof: "C-Zuchi · Fruition Motors",
  },
  {
    title: "Dashboards & web apps",
    body: "Interfaces people use every day — clear data, quick actions, no dead ends.",
    proof: "Frexiq vendor dashboard · Novacrust Business",
  },
  {
    title: "Payments & booking flows",
    body: "Checkout, booking and quote flows built so fewer users drop off halfway through.",
    proof: "C-Zuchi (Paystack) · Youfanly",
  },
];

function Home() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>

        <div className="wrap hero__inner">
          <div className="hero__id rise" style={{ "--i": 0 }}>
            <span className="avatar avatar--status">
              <img src={site.photos.avatar} alt={`${site.name}`} width="48" height="48" />
            </span>
            <p className="eyebrow">
              {site.role} · {site.location}
            </p>
          </div>

          <h1 id="hero-title" className="hero__title">
            <span className="line">
              <span style={{ "--i": 1 }}>I build frontends</span>
            </span>{" "}
            <span className="line">
              <span style={{ "--i": 2 }}>
                that <em>ship.</em>
              </span>
            </span>
          </h1>

          <div className="hero__grid">
            <p className="hero__lede rise" style={{ "--i": 4 }}>
              I'm {site.name} — I turn designs into fast, production-ready web and mobile apps with React,
              Next.js and React Native. 3+ years shipping for teams in Nigeria, the UK and India, from a
              500-bookings-a-day dashboard at Frexiq to a Google Play launch at Zysk.
            </p>
            <div className="hero__actions rise" style={{ "--i": 5 }}>
              <a href="#work" className="btn btn--solid btn--lg">
                See selected work <span aria-hidden="true">↓</span>
              </a>
              <a href={site.resume} download={site.resumeFileName} className="btn btn--ghost btn--lg">
                Résumé (PDF)
              </a>
            </div>
          </div>

          <div className="hero__proof rise" style={{ "--i": 6 }}>
            <span className="hero__proof-label">Shipped for</span>
            <ul>
              {clients.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="marquee" aria-label="Capabilities">
        <div className="marquee__track">
          {[0, 1].map((n) => (
            <ul key={n} aria-hidden={n === 1 ? "true" : undefined}>
              {capabilities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className="wrap stats" aria-label="By the numbers">
        {stats.map((st, i) => (
          <div key={st.label} className="stat reveal" style={{ transitionDelay: `${i * 80}ms` }}>
            <p className="stat__value">{st.value}</p>
            <p className="stat__label">{st.label}</p>
          </div>
        ))}
      </section>

      <section id="work" className="section wrap" aria-labelledby="work-title">
        <div className="section-head reveal">
          <p className="eyebrow">Selected work · {featuredProjects.length} case studies</p>
          <h2 id="work-title" className="section-title">
            Live products, <em>real users.</em>
          </h2>
          <Link to="/project" className="link-arrow section-head__aside">
            All {projects.length} projects <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="cases">
          {featuredProjects.map((p, i) => (
            <CaseStudy key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="more-title">
        <div className="section-head reveal">
          <p className="eyebrow">Index</p>
          <h2 id="more-title" className="section-title">
            More <em>builds.</em>
          </h2>
        </div>
        <ProjectIndex projects={moreProjects} startAt={featuredProjects.length} />
      </section>

      <section className="section wrap" aria-labelledby="xp-title">
        <div className="section-head reveal">
          <p className="eyebrow">Experience</p>
          <h2 id="xp-title" className="section-title">
            Where I've <em>shipped.</em>
          </h2>
          <a href={site.resume} download={site.resumeFileName} className="link-arrow section-head__aside">
            Full CV (PDF) <span aria-hidden="true">↓</span>
          </a>
        </div>
        <Experience />
      </section>

      <section className="section wrap" aria-labelledby="services-title">
        <div className="section-head reveal">
          <p className="eyebrow">Services</p>
          <h2 id="services-title" className="section-title">
            What I can build <em>for you.</em>
          </h2>
        </div>
        <ol className="services">
          {services.map((s, i) => (
            <li key={s.title} className="service reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="service__num">0{i + 1}</span>
              <h3 className="service__title">{s.title}</h3>
              <p className="service__body">{s.body}</p>
              <p className="service__proof">
                <span>Seen in</span> {s.proof}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section wrap intro" aria-labelledby="intro-title">
        <figure className="intro__figure reveal">
          <img
            className="intro__img"
            src={site.photos.portrait}
            alt={`${site.name} in a burgundy native outfit, standing in front of an ornate bronze gate`}
            loading="lazy"
            width="880"
            height="1100"
          />
          <figcaption>
            <span className="status-dot" aria-hidden="true" /> {site.availability}
          </figcaption>
        </figure>
        <div className="intro__text reveal">
          <p className="eyebrow">How I work</p>
          <h2 id="intro-title" className="section-title">
            Pixel-careful, <em>deadline-honest.</em>
          </h2>
          <ul className="principles">
            <li>
              <strong>Design fidelity.</strong> Your Figma, built to the pixel — responsive and accessible
              by default.
            </li>
            <li>
              <strong>Product sense.</strong> I've built for commerce, payments, creators, learning and
              bookings, so I ask about the user before the component.
            </li>
            <li>
              <strong>Full-stack reach.</strong> Comfortable in Node.js, MongoDB and Redis when the
              frontend needs an API — and in EAS when the app needs a store release.
            </li>
          </ul>
          <Link to="/about" className="link-arrow">
            More about me <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
