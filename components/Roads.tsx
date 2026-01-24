'use client'

import React, { useEffect, useState, RefObject } from "react";
import { Divider, Button } from "semantic-ui-react";
import { IRoad, IFavorite, IRoadStatus } from "@/lib/types";
import Road from "./Road";
import Ad from "./Ad";
import Annonse from "./Annonse";

type RoadsProps = {
  roads: IRoad[];
  favorites: IFavorite[];
  initialStatuses?: { [key: string]: IRoadStatus };
};

type RoadAndAdProps = {
  road: IRoad;
  initialStatus?: IRoadStatus;
};

type RefDataObject = {
  active: boolean;
  road: IRoad;
  ref: RefObject<HTMLDivElement>;
  key: string;
};

const RoadAndAd = React.forwardRef<HTMLDivElement, RoadAndAdProps>((props, ref) => {
  const r = props.road;
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    // Only decide on client side to avoid hydration mismatch
    if (typeof window !== 'undefined' && window.adsbygoogle?.loaded) {
      setShowAd(Math.random() < 0.5);
    }
  }, []);

  return (
    <div ref={ref} key={`container-${r.urlFriendly}`}>
      <Road road={r} initialStatus={props.initialStatus} />
      <Divider />
      {showAd ? <Ad /> : <Annonse />}
    </div>
  );
});

RoadAndAd.displayName = 'RoadAndAd';

const Roads = (props: RoadsProps) => {
  const [isMobile, setMobile] = useState<boolean>(false);
  const refs: RefDataObject[] = [];

  useEffect(() => {
    setMobile(window.innerWidth < 600 || window.innerHeight < 900);
  }, []);

  const roads = [...props.favorites]
    .reverse()
    .map((f) => props.roads.find((r) => r.urlFriendly === f))
    .filter(Boolean)
    .map((value, i) => {
      const r = value as IRoad;
      const ref = React.createRef<HTMLDivElement>();
      refs.push({
        active: i === 0 ? true : false,
        ref,
        road: r,
        key: r.urlFriendly,
      });
      const initialStatus = props.initialStatuses?.[r.urlFriendly];
      return <RoadAndAd ref={ref} key={r.urlFriendly} road={r} initialStatus={initialStatus} />;
    });

  const scrollToNextRoad = (event: any) => {
    const button = event.target.closest("button");
    let activeRoadIndex = refs.findIndex((r) => r.active === true);
    refs[activeRoadIndex].active = false;

    const nextRoadIndex = ++activeRoadIndex % refs.length;
    const nextRoad = refs[nextRoadIndex];

    nextRoad.active = true;
    refs[nextRoadIndex] = nextRoad;
    nextRoad.ref.current?.scrollIntoView({
      behavior: "smooth",
    });

    if (nextRoadIndex === refs.length - 1) {
      button.style.transform = "rotate(-180deg)";
    } else {
      button.style.transform = "rotate(0)";
    }
  };

  return (
    <>
      {roads}
      {isMobile && (
        <Button
          size="massive"
          color="red"
          circular
          active={false}
          icon={`arrow down`}
          onClick={(event) => scrollToNextRoad(event)}
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
