import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { site, primaryContact } from "../../data/site";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const holder = useRef(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const measure = () => holder.current && setWidth(Math.min(holder.current.clientWidth, 900));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="page">
      <header className="wrap page-head page-head--row">
        <div>
          <p className="eyebrow rise" style={{ "--i": 0 }}>
            Résumé
          </p>
          <h1 className="page-title rise" style={{ "--i": 1 }}>
            The one-page <em>version.</em>
          </h1>
        </div>
        <div className="hero__actions rise" style={{ "--i": 2 }}>
          <a className="btn btn--solid btn--lg" href={site.resume} download={site.resumeFileName}>
            Download PDF <span aria-hidden="true">↓</span>
          </a>
          <a
            className="btn btn--ghost btn--lg"
            href={primaryContact.href}
            {...(primaryContact.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            Get in touch
          </a>
        </div>
      </header>

      <section className="wrap resume rise" style={{ "--i": 3 }} ref={holder}>
        <Document
          file={site.resume}
          loading={<div className="resume__skeleton" aria-label="Loading résumé" />}
          error={
            <p className="resume__error">
              Couldn't preview the PDF —{" "}
              <a href={site.resume} download={site.resumeFileName}>
                download it instead
              </a>
              .
            </p>
          }
        >
          <Page pageNumber={1} width={width} renderTextLayer={false} />
        </Document>
      </section>
    </div>
  );
}

export default ResumeNew;
