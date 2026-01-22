'use client'

import { FC, useEffect, useState, useMemo } from "react";
import { IRoad, IRoadStatus, ISource } from "@/lib/types";
import { Card, Feed, Popup, Item, Button } from "semantic-ui-react";
import StatusSvg from "./StatusSvg";

type RoadProps = {
  road: IRoad;
  initialStatus?: IRoadStatus;
};

const Road: FC<RoadProps> = (props) => {
  const [road, setRoad] = useState<IRoadStatus | undefined>(props.initialStatus);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [loading, setLoading] = useState(!props.initialStatus);
  const { roadName } = props.road;

  useMemo(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setShouldUpdate(true);
      } else {
        setShouldUpdate(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!props.initialStatus || shouldUpdate) {
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
        .then(() => setLoading(false))
        .catch((err) => {
          console.error('Failed to fetch road status:', err);
          setLoading(false);
        });
    }
  }, [props.road, shouldUpdate, props.initialStatus]);

  if (loading || !road) {
    return (
      <Card fluid>
        <Card.Content>
          <Item.Group>
            <Popup
              on={["click"]}
              trigger={
                <Button
                  onClick={() => {}}
                  style={{ position: "absolute", right: "10px" }}
                  icon="external share"
                  alt="Del link til stengttunnel.no"
                  circular
                  basic
                />
              }
              content="Kopiert linken"
              inverted
            />
            <Item floated="left" style={{ margin: 0 }}>
              <Item.Image style={{ width: "auto" }} size="tiny">
                <StatusSvg
                  role="img"
                  aria-label="Trafikklys som viser gult lys"
                  className="yellow"
                />
              </Item.Image>
              <Item.Content verticalAlign="middle">
                <Item.Header as="h2" aria-label={`Vennligst vent. Laster status for ${roadName}`}>
                  Tunnelen er ...
                </Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card.Content>
        <Card.Content extra>
          <Feed />
        </Card.Content>
      </Card>
    );
  }

  const { status, messages, statusMessage } = road;

  const messageFeed = messages.map((message, index) => {
    const df = new Intl.DateTimeFormat(["nb-no", "da", "sv", "en-us", "en-gb"], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const times = (
      <>
        <time dateTime={new Date(message.validFrom).toISOString()}>
          {df.format(new Date(message.validFrom))}
        </time>{" "}
        -{" "}
        <time dateTime={new Date(message.validTo).toISOString()}>
          {df.format(new Date(message.validTo))}
        </time>
      </>
    );

    return (
      <Feed.Event key={"message-" + index}>
        <Popup
          on={"click"}
          trigger={
            message.source === ISource.StatensVegvesen ? (
              <Feed.Label>
                <img
                  alt="Meldingen leveres av Statens Vegvesen"
                  width="35"
                  height="23"
                  src="/vv_logo.png"
                />
              </Feed.Label>
            ) : (
              <Feed.Label icon="user outline" />
            )
          }
          content={message.source}
          inverted
        />
        <Feed.Content>
          <Feed.Date content={times} aria-label={`Meldingen gjelder i perioden:`} />
          <Feed.Summary>{message.message}</Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    );
  });

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

  const statusToColors: { [key: string]: string } = {
    green: "grønt",
    yellow: "gult",
    red: "rødt",
  };

  return (
    <Card fluid data-testid="road">
      <Card.Content>
        <Item.Group>
          <Popup
            on={["click"]}
            trigger={
              <Button
                onClick={share}
                style={{ position: "absolute", right: "10px" }}
                icon="external share"
                aria-label={`Del link til Stengt tunnels side for ${roadName}`}
                circular
                basic
              />
            }
            content="Kopiert linken"
            inverted
          />
          <Item floated="left" style={{ margin: 0 }}>
            <Item.Image style={{ width: "auto" }} size="tiny">
              <StatusSvg
                role="img"
                aria-label={`Trafikklys som viser ${statusToColors[status]} lys`}
                className={status}
              />
            </Item.Image>
            <Item.Content verticalAlign="middle">
              <Item.Header data-testid="status" as="h2">
                {statusMessage.replace(/^Tunnelen/, roadName)}
              </Item.Header>
            </Item.Content>
          </Item>
        </Item.Group>
      </Card.Content>
      <Card.Content extra>
        <Feed>{messageFeed}</Feed>
      </Card.Content>
    </Card>
  );
};

export default Road;
