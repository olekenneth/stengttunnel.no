import React, { useEffect, useMemo, useRef, useState } from "react";
import { RefObject } from "react";

import { Divider, Button } from "semantic-ui-react";
import "./App.css";
import { IRoad, IFavorite } from "./types";
import Road from "./Road";
import Ad from "./Ad";
import Annonse from "./Annonse";

type RoadsProps = {
  roads: IRoad[];
  favorites: IFavorite[];
};

type RoadAndAdProps = {
  road: IRoad;
  showAd: boolean;
  adsDisabled: boolean;
};

const RoadAndAd = React.forwardRef<HTMLDivElement, RoadAndAdProps>(
  (props, ref) => {
    const r = props.road;
    return (
      <div ref={ref}>
        <Road road={r} />
        {!props.adsDisabled && <Divider />}
        {!props.adsDisabled && (props.showAd ? <Ad /> : <Annonse />)}
      </div>
    );
  }
);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobileViewport = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 600 || window.innerHeight < 900);

const Roads = (props: RoadsProps) => {
  const [isMobile, setMobile] = useState<boolean>(false);
  const refsRef = useRef<Array<RefObject<HTMLDivElement>>>([]);
  const activeIndexRef = useRef<number>(0);
  // Disable ads in environments that set REACT_APP_DISABLE_ADS=true
  // (e.g. Cloudflare preview deployments) so previewers don't see large
  // empty ad placeholders.
  const adsDisabled = process.env.REACT_APP_DISABLE_ADS === "true";

  useEffect(() => {
    const onResize = () => setMobile(isMobileViewport());
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  const orderedRoads = useMemo(() => {
    return [...props.favorites]
      .reverse()
      .map((f) => props.roads.find((r) => r.urlFriendly === f))
      .filter(Boolean) as IRoad[];
  }, [props.favorites, props.roads]);

  // Decide showAd once per road in the list, deterministically per render of
  // the list (still random, but doesn't flip if a child re-renders).
  const adChoices = useMemo(
    () =>
      orderedRoads.map(
        () => Boolean(window.adsbygoogle?.loaded) && Math.random() < 0.5
      ),
    [orderedRoads]
  );

  // Keep the refs array in sync with the rendered list (no mutation during render).
  if (refsRef.current.length !== orderedRoads.length) {
    refsRef.current = orderedRoads.map(
      (_, i) => refsRef.current[i] ?? React.createRef<HTMLDivElement>()
    );
    activeIndexRef.current = 0;
  }

  const scrollToNextRoad = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = (event.target as HTMLElement).closest("button");
    const refs = refsRef.current;
    if (refs.length === 0) return;

    const nextIndex = (activeIndexRef.current + 1) % refs.length;
    activeIndexRef.current = nextIndex;

    refs[nextIndex].current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });

    if (button) {
      button.style.transform =
        nextIndex === refs.length - 1 ? "rotate(-180deg)" : "rotate(0)";
    }
  };

  return (
    <>
      {orderedRoads.map((r, i) => (
        <RoadAndAd
          ref={refsRef.current[i]}
          key={r.urlFriendly}
          road={r}
          showAd={adChoices[i]}
          adsDisabled={adsDisabled}
        />
      ))}
      {isMobile && orderedRoads.length > 1 && (
        <Button
          size="massive"
          color="red"
          circular
          active={false}
          icon={`arrow down`}
          aria-label="Bla til neste tunnel"
          onClick={scrollToNextRoad}
          style={{
            zIndex: 10000,
            position: "fixed",
            bottom: "25px",
            left: "50%",
            marginLeft: "-31px",
          }}
        />
      )}
    </>
  );
};

export default Roads;
