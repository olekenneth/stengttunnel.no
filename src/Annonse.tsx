import React, { useEffect, useState } from "react";
import "./Annonse.css";

const SLIDES: React.ReactNode[] = [
  <>
    <span className="accent">139</span> oppdaterte spørsmål i{" "}
    <strong>25 kategorier</strong>
  </>,
  <>
    <strong>599,-</strong> for 3 måneders full tilgang
  </>,
  <>
    Umiddelbar <strong>forklaring</strong> og kildehenvisning
  </>,
  <>
    Øv på <strong>mobil, nettbrett og PC</strong> – ingen app
  </>,
  <>
    Ingen automatisk fornyelse – <strong>engangskjøp</strong>
  </>,
  <>
    <span className="accent">★★★★★</span> 4,9 av 5 i kundevurdering
  </>,
];

const ROTATE_INTERVAL_MS = 3000;

const Annonse = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (SLIDES.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <a
      className="bfq-ad"
      href="https://xn--btfrerquizen-tcb2y.no/?utm_source=stengttunnel&utm_medium=banner&utm_campaign=annonse"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Båtførerquizen – øv til båtførerprøven på nett"
    >
      <div className="bfq-ad-inner">
        <div className="bfq-ad-icon" aria-hidden="true">
          ⚓
        </div>
        <div className="bfq-ad-body">
          <div className="bfq-ad-eyebrow">Båtførerquizen.no</div>
          <div className="bfq-ad-title">
            Bestå båtførerprøven – med selvtillit
          </div>
          <div className="bfq-ad-rotator" aria-live="polite">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`bfq-ad-slide${
                  i === current ? " is-active" : ""
                }`}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>
        <div className="bfq-ad-cta">Start quiz →</div>
      </div>
    </a>
  );
};

export default Annonse;
