import React, { useEffect, useRef } from "react";
import { registerStage } from "../../gl/cards";
import { hostOf } from "../../data/projects";

// Full-width case-study row: tinted stage with a pointer-tilted browser frame
// on one side, the story on the other. Rows alternate sides via CSS.
function CaseStudy({ project, index }) {
  const stage = useRef(null);
  const { title, sector, tagline, summary, highlights = [], stack = [], role, year } = project;
  const num = String(index + 1).padStart(2, "0");

  // hand the stage to the WebGL renderer (no-op without WebGL / with reduced motion)
  useEffect(
    () =>
      registerStage(stage.current, {
        image: project.image,
        secondaryImage: project.secondaryImage,
        host: hostOf(project.live),
        tint: project.tint,
      }),
    [project]
  );

  const onMove = (e) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -6}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 8}deg`);
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const onLeave = () => {
    const el = stage.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article className="case reveal" style={{ "--tint": project.tint }}>
      <a
        ref={stage}
        href={project.live}
        target="_blank"
        rel="noreferrer"
        className="case__stage"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={`Visit ${title} (opens in a new tab)`}
      >
        <span className="case__num" aria-hidden="true">
          {num}
        </span>
        <div className="frame case__frame">
          <div className="frame__bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="frame__url">{hostOf(project.live)}</span>
          </div>
          <div className="frame__view">
            <img src={project.image} alt={`${title} homepage`} loading="lazy" decoding="async" />
          </div>
        </div>
        {project.secondaryImage && (
          <div className="frame case__frame case__frame--sub" aria-hidden="true">
            <div className="frame__bar">
              <i />
              <i />
              <i />
            </div>
            <div className="frame__view">
              <img src={project.secondaryImage} alt="" loading="lazy" decoding="async" />
            </div>
          </div>
        )}
        <span className="case__visit" aria-hidden="true">
          Visit site ↗
        </span>
      </a>

      <div className="case__body">
        <p className="case__meta">
          <span className="case__meta-num">{num}</span>
          <span>{sector}</span>
          {year && <span>{year}</span>}
          {role && <span>{role}</span>}
        </p>
        <h3 className="case__title">{title}</h3>
        {tagline && <p className="case__tagline">{tagline}</p>}
        <p className="case__summary">{summary}</p>

        {highlights.length > 0 && (
          <ul className="case__highlights">
            {highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        {stack.length > 0 && (
          <ul className="tags">
            {stack.map((s) => (
              <li key={s} className="tag tag--mono">
                {s}
              </li>
            ))}
          </ul>
        )}

        <div className="case__actions">
          <a href={project.live} target="_blank" rel="noreferrer" className="btn btn--solid">
            Visit live site <span aria-hidden="true">↗</span>
          </a>
          {(project.links || []).map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="link-arrow">
              {l.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          {project.repo && (
            <a href={project.repo} target="_blank" rel="noreferrer" className="link-arrow">
              Source <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default CaseStudy;
