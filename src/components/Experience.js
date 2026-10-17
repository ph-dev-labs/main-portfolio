import React from "react";
import { experience } from "../data/experience";

// Scannable timeline: one line per role, bullets on expand.
function Experience({ openFirst = false }) {
  return (
    <ol className="xp">
      {experience.map((x, i) => (
        <li key={x.company + x.period} className="xp__item reveal">
          <details open={openFirst && i === 0}>
            <summary className="xp__row">
              <span className="xp__period">
                {x.current && <span className="status-dot" aria-hidden="true" />}
                {x.period}
              </span>
              <span className="xp__role">
                {x.role}
                <span className="xp__company"> · {x.company}</span>
              </span>
              <span className="xp__place">{x.place}</span>
              <span className="xp__toggle" aria-hidden="true" />
            </summary>
            <ul className="xp__points">
              {x.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ol>
  );
}

export default Experience;
