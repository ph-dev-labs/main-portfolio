import React, { useEffect, useRef, useState } from "react";
import { hostOf } from "../../data/projects";

// Compact editorial index. On hover-capable devices a preview follows the cursor;
// on touch, each row shows an inline thumbnail instead.
function ProjectIndex({ projects, startAt = 0 }) {
  const preview = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef(0);
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (active === null) return undefined;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.18;
      p.y += (p.ty - p.y) * 0.18;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${(p.tx - p.x) * 0.04}deg)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  const onMove = (e) => {
    const p = pos.current;
    p.tx = e.clientX;
    p.ty = e.clientY;
    if (active === null) {
      p.x = p.tx;
      p.y = p.ty;
    }
  };

  return (
    <div className="index" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
      <ol className="index__list">
        {projects.map((p, i) => (
          <li key={p.slug} className="index__row reveal">
            <a
              href={p.live}
              target="_blank"
              rel="noreferrer"
              className="index__link"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(null)}
            >
              <span className="index__num">{String(startAt + i + 1).padStart(2, "0")}</span>
              <img className="index__thumb" src={p.image} alt="" loading="lazy" />
              <span className="index__title">{p.title}</span>
              <span className="index__summary">{p.summary}</span>
              <span className="index__sector">{p.sector}</span>
              <span className="index__host">
                {hostOf(p.live)} <span aria-hidden="true">↗</span>
              </span>
            </a>
            {p.repo ? (
              <a href={p.repo} target="_blank" rel="noreferrer" className="index__repo">
                Source ↗
              </a>
            ) : (
              <span aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div ref={preview} className={`index__preview ${active !== null ? "is-on" : ""}`} aria-hidden="true">
        {projects.map((p, i) => (
          <img key={p.slug} src={p.image} alt="" className={i === active ? "is-active" : ""} />
        ))}
      </div>
    </div>
  );
}

export default ProjectIndex;
