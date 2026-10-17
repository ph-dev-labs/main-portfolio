import React from "react";
import CaseStudy from "./CaseStudy";
import ProjectIndex from "./ProjectIndex";
import { projects, featuredProjects, moreProjects } from "../../data/projects";

function Projects() {
  return (
    <div className="page">
      <header className="wrap page-head">
        <p className="eyebrow rise" style={{ "--i": 0 }}>
          Work · {projects.length} projects
        </p>
        <h1 className="page-title rise" style={{ "--i": 1 }}>
          Products I've <em>shipped.</em>
        </h1>
        <p className="page-lede rise" style={{ "--i": 2 }}>
          Production web apps for logistics, marketplace, creator-economy, fintech and edtech teams — plus
          a few things I built to learn.
        </p>
      </header>

      <section className="wrap cases" aria-label="Case studies">
        {featuredProjects.map((p, i) => (
          <CaseStudy key={p.slug} project={p} index={i} />
        ))}
      </section>

      <section className="wrap section" aria-labelledby="index-title">
        <div className="section-head reveal">
          <p className="eyebrow">Index</p>
          <h2 id="index-title" className="section-title">
            More <em>builds.</em>
          </h2>
        </div>
        <ProjectIndex projects={moreProjects} startAt={featuredProjects.length} />
      </section>
    </div>
  );
}

export default Projects;
