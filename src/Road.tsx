import React, { FC, useEffect, useState, useMemo } from "react";
import ReactGA from "react-ga";
import { IRoad, IRoadStatus, ISource } from "./types";
import { Card, Descriptions, Skeleton } from "antd";

type RoadProps = {
  road: IRoad;
};

const Road: FC<any> = (props: RoadProps) => {
  const [road, setRoad] = useState<IRoadStatus>();
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const { roadName } = props.road;

  useMemo(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        setShouldUpdate(true);
      } else {
        setShouldUpdate(false);
      }
    });
  }, []);

  useEffect(() => {
    // ReactGA.pageview("/" + props.road.urlFriendly);

    setLoading(true);
    fetch(props.road.url)
      .then((r) => r.json())
      .then((r) => {
        return {
          ...r,
          ...props.road,
        };
      })
      .then(setRoad)
      .then(() => setLoading(false));
  }, [props.road, shouldUpdate]);

  if (loading) {
    return (
      <Card>
        <Descriptions title={roadName} />
        <Skeleton active />
      </Card>
    );
  }
  const { status, messages, statusMessage } = road!;

  // const image = `https://stengttunnel.no/status/${status}.png`;
  // const messageFeed = messages.map((message, index) => {
  //   const df = new Intl.DateTimeFormat(
  //     ["nb-no", "da", "sv", "en-us", "en-gb"],
  //     {
  //       weekday: "short",
  //       month: "short",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     }
  //   );

  //   const times = `${df.format(new Date(message.validFrom))} - ${df.format(
  //     new Date(message.validTo)
  //   )}`;
  //   return (
  //     <Feed.Event key={"message-" + index}>
  //       <Popup
  //         on={"click"}
  //         trigger={
  //           message.source === ISource.StatensVegvesen ? (
  //             <Feed.Label image="/vv_logo.png" />
  //           ) : (
  //             <Feed.Label icon="user outline" />
  //           )
  //         }
  //         content={message.source}
  //         inverted
  //       />
  //       <Feed.Content>
  //         <Feed.Date content={times} />
  //         <Feed.Summary>{message.message}</Feed.Summary>
  //       </Feed.Content>
  //     </Feed.Event>
  //   );
  // });

  const share = async () => {
    let shareNavigator = window.navigator as any;
    const host = new URL(window.location.href);
    const url = `${host.protocol}//${host.host}/${props.road.urlFriendly}`;

    if (shareNavigator.clipboard) {
      await window.navigator.clipboard.writeText(url);
    }
    if (shareNavigator.share) {
      await window.navigator.share({
        title: "Stengt tunnel",
        text: statusMessage + "\nSe mer på ",
        url,
      });
    }
  };

  return <Card role="road">{roadName}</Card>;
};

export default Road;
