import React from "react";
import Github from "./Github";
import Experience from "../Experience";
import { site } from "../../data/site";

const skills = [
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Redux", "TanStack Query", "Tailwind CSS", "HTML & CSS"],
  },
  {
    group: "Mobile",
    items: ["React Native", "Expo", "EAS Build", "Push notifications (FCM/APNs)", "Deep linking", "Google Play release"],
  },
  {
    group: "Design to code",
    items: ["Figma to production UI", "Accessibility (WCAG-aware)", "Cross-browser & device testing", "SEO-friendly markup"],
  },
  {
    group: "Backend & tools",
    items: ["Node.js", "MongoDB", "Redis", "REST APIs", "Git", "CI/CD", "Vite / Webpack", "Cloudinary", "Ethers.js"],
  },
];

function About() {
  return (
    <div className="page">
      <header className="wrap page-head">
        <p className="eyebrow rise" style={{ "--i": 0 }}>
          About
        </p>
        <h1 className="page-title rise" style={{ "--i": 1 }}>
          Engineer first, <em>product-minded</em> always.
        </h1>
      </header>

      <section className="wrap about">
        <figure className="about__figure rise" style={{ "--i": 2 }}>
          <img
            src={site.photos.full}
            alt={`${site.name}, full length, in a burgundy native outfit in front of an ornate bronze gate`}
            width="900"
            height="1200"
          />
          <figcaption>{site.location}</figcaption>
        </figure>

        <div className="about__body prose rise" style={{ "--i": 3 }}>
          <p className="prose__lead">
            I'm {site.fullName}, a frontend and React Native developer in Port Harcourt with 3+ years
            building web and mobile apps for teams in Nigeria, the UK and India.
          </p>
          <p>
            Most recently I took Zysk Group's Expo app from first commit to a Google Play release, with
            push notifications and deep links wired end to end. Before that I cut page loads by about three
            seconds at Sprinble and built Frexiq's vendor dashboard, which handles 500+ bookings a day.
            That range — commerce, payments, creators, bookings — taught me to care about the person on the
            other side of the screen as much as the code behind it.
          </p>
          <p>
            I hold a B.Tech in Soil Science and Technology from the Federal University of Technology,
            Owerri (FUTO). Off the clock you'll find me playing chess, gaming, travelling, or mentoring
            other developers.
          </p>
          <blockquote className="pull">
            "Create meaningful solutions, build impactful products, and focus on positive societal impact
            through your skills."
          </blockquote>
        </div>
      </section>

      <section className="wrap section" aria-labelledby="xp-title">
        <div className="section-head reveal">
          <p className="eyebrow">Experience</p>
          <h2 id="xp-title" className="section-title">
            Where I've <em>shipped.</em>
          </h2>
          <a href={site.resume} download={site.resumeFileName} className="link-arrow section-head__aside">
            Full CV (PDF) <span aria-hidden="true">↓</span>
          </a>
        </div>
        <Experience openFirst />
      </section>

      <section className="wrap section" aria-labelledby="skills-title">
        <div className="section-head reveal">
          <p className="eyebrow">Toolkit</p>
          <h2 id="skills-title" className="section-title">
            What I work <em>with.</em>
          </h2>
        </div>
        <dl className="skills">
          {skills.map((s) => (
            <div key={s.group} className="skills__row reveal">
              <dt>{s.group}</dt>
              <dd>
                <ul className="tags">
                  {s.items.map((i) => (
                    <li key={i} className="tag tag--lg">
                      {i}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Github />
    </div>
  );
}

export default About;
