import React, { useEffect, useMemo, useState } from "react";
import "./Annonse.css";

type Campaign = {
  id: string;
  // Relative share of impressions. Values are summed across all campaigns
  // and used as a weighted distribution; they do not need to add up to 1
  // or 100. Set to 0 to disable a campaign without removing it.
  weight: number;
  href: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  icon: string;
  cta: string;
  slides: React.ReactNode[];
  // CSS variables applied to the root anchor; see Annonse.css for the
  // variable names. Lets each campaign theme the same banner shell.
  theme: {
    gradient: string;
    iconBg: string;
    iconBorder: string;
    accent: string;
    ctaBg: string;
    ctaShadow: string;
    shadow: string;
  };
};

const BATFORERQUIZEN: Campaign = {
  id: "batforerquizen",
  weight: 80,
  href: "https://xn--btfrerquizen-tcb2y.no/?utm_source=stengttunnel&utm_medium=banner&utm_campaign=annonse",
  ariaLabel: "Båtførerquizen – øv til båtførerprøven på nett",
  eyebrow: "Båtførerquizen.no",
  title: "Bestå båtførerprøven – med selvtillit",
  icon: "⚓",
  cta: "Start quiz →",
  slides: [
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
  ],
  theme: {
    gradient: "linear-gradient(135deg, #06111e 0%, #0b2545 55%, #13315c 100%)",
    iconBg: "rgba(142, 202, 230, 0.15)",
    iconBorder: "rgba(142, 202, 230, 0.3)",
    accent: "#8ecae6",
    ctaBg: "#1d6fb8",
    ctaShadow: "rgba(29, 111, 184, 0.4)",
    shadow: "rgba(11, 37, 69, 0.18)",
  },
};

const REGNSKAP_1G: Campaign = {
  id: "1g",
  weight: 20,
  href: "https://1-g.no/?utm_source=stengttunnel&utm_medium=banner&utm_campaign=annonse",
  ariaLabel: "1 G – norsk regnskap for 29 kroner i måneden",
  eyebrow: "1-g.no",
  title: "Norsk regnskap for 29,-/mnd",
  icon: "🧾",
  cta: "Kom i gang →",
  slides: [
    <>
      Regnskap for <strong>29,-/mnd</strong>
    </>,
    <>
      <span className="accent">🇳🇴</span> Bygget for{" "}
      <strong>norske regler</strong>
    </>,
    <>
      MVA-melding rett til <strong>Skatteetaten</strong>
    </>,
    <>
      Ingen oppstartskostnad – <strong>si opp når du vil</strong>
    </>,
    <>
      Faktura, MVA og bokføring – <strong>alt inkludert</strong>
    </>,
    <>
      Brøkdel av <strong>Fiken/Tripletex</strong>-prisen
    </>,
    <>
      Klar på <span className="accent">2 minutter</span>
    </>,
  ],
  theme: {
    gradient: "linear-gradient(135deg, #0b1220 0%, #111827 55%, #1e293b 100%)",
    iconBg: "rgba(96, 165, 250, 0.18)",
    iconBorder: "rgba(96, 165, 250, 0.35)",
    accent: "#60a5fa",
    ctaBg: "#2563eb",
    ctaShadow: "rgba(37, 99, 235, 0.4)",
    shadow: "rgba(17, 24, 39, 0.22)",
  },
};

const CAMPAIGNS: Campaign[] = [BATFORERQUIZEN, REGNSKAP_1G];

const ROTATE_INTERVAL_MS = 3000;

// Pick a campaign using each campaign's `weight` as relative share. Weights
// are summed, so e.g. weights of 80 and 20 give a 80%/20% split, but 4 and 1
// would yield the same distribution.
const pickWeightedCampaign = (campaigns: Campaign[]): Campaign => {
  const eligible = campaigns.filter((c) => c.weight > 0);
  if (eligible.length === 0) return campaigns[0];
  const total = eligible.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * total;
  for (const c of eligible) {
    roll -= c.weight;
    if (roll < 0) return c;
  }
  return eligible[eligible.length - 1];
};

const Annonse = () => {
  // Pick one campaign per mount so the user sees the same ad while the page
  // is open, but different visits / different RoadAndAd instances rotate
  // between campaigns according to the configured weights.
  const campaign = useMemo(() => pickWeightedCampaign(CAMPAIGNS), []);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (campaign.slides.length <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % campaign.slides.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [campaign]);

  // Map theme values to CSS custom properties consumed by Annonse.css.
  const themeStyle = {
    "--bfq-gradient": campaign.theme.gradient,
    "--bfq-icon-bg": campaign.theme.iconBg,
    "--bfq-icon-border": campaign.theme.iconBorder,
    "--bfq-accent": campaign.theme.accent,
    "--bfq-cta-bg": campaign.theme.ctaBg,
    "--bfq-cta-shadow": campaign.theme.ctaShadow,
    "--bfq-shadow": campaign.theme.shadow,
  } as React.CSSProperties;

  return (
    <a
      className="bfq-ad"
      href={campaign.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={campaign.ariaLabel}
      data-campaign={campaign.id}
      style={themeStyle}
    >
      <div className="bfq-ad-inner">
        <div className="bfq-ad-icon" aria-hidden="true">
          {campaign.icon}
        </div>
        <div className="bfq-ad-body">
          <div className="bfq-ad-eyebrow">{campaign.eyebrow}</div>
          <div className="bfq-ad-title">{campaign.title}</div>
          <div className="bfq-ad-rotator" aria-live="polite">
            {campaign.slides.map((slide, i) => (
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
        <div className="bfq-ad-cta">{campaign.cta}</div>
      </div>
    </a>
  );
};

export default Annonse;
