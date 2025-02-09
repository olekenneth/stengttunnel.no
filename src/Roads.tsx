import React, { useEffect, useState } from "react";
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
};

type RefDataObject = {
  active: boolean;
  road: IRoad;
  ref: RefObject<HTMLDivElement | null>;
  key: string;
};

const RoadAndAd = React.forwardRef((props: RoadAndAdProps, ref: any) => {
  const r = props.road;
  const showAd = Math.random() < 0.5;
  return (
    <div ref={ref} key={`container-${r.urlFriendly}`}>
      <Road road={r} />
      <Divider />
      {showAd ? <Ad /> : <Annonse />}
    </div>
  );
});

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
      return <RoadAndAd ref={ref} key={r.urlFriendly} road={r} />;
    });

  const scrollToNextRoad = (event: any, data: any) => {
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
          onClick={(event, data) => scrollToNextRoad(event, data)}
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
