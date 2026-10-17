import React from "react";
import GitHubCalendar from "react-github-calendar";

function Github() {
  return (
    <section className="wrap section" aria-labelledby="gh-title">
      <div className="section-head reveal">
        <p className="eyebrow">Consistency</p>
        <h2 id="gh-title" className="section-title">
          Days I <em>code.</em>
        </h2>
        <a
          href="https://github.com/ph-dev-labs"
          target="_blank"
          rel="noreferrer"
          className="link-arrow section-head__aside"
        >
          @ph-dev-labs <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="gh-cal reveal">
        <GitHubCalendar
          username="ph-dev-labs"
          blockSize={13}
          blockMargin={4}
          color="#e8461e"
          fontSize={13}
        />
      </div>
    </section>
  );
}

export default Github;
