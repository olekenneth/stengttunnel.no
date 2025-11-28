import React, { FC, useEffect, useState, useMemo } from "react";
import { IRoad, IRoadStatus, ISource } from "./types";
import { Card, Feed, Popup, Item, Button } from "semantic-ui-react";
import { ReactComponent as StatusSvg } from "./status.svg";

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
                ></Button>
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
                <Item.Header as="h2" aria-label={`Vennligst vent. Laster status for ${roadName}`}>Tunnelen er ...</Item.Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Card.Content>
        <Card.Content extra>
          <Feed></Feed>
        </Card.Content>
      </Card>
    );
  }
  const { status, messages, statusMessage } = road!;

  const messageFeed = messages.map((message, index) => {
    const df = new Intl.DateTimeFormat(
      ["nb-no", "da", "sv", "en-us", "en-gb"],
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

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
          <Feed.Date
            content={times}
            aria-label={`Meldingen gjelder i perioden:`}
          />
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

  const statusToColors = {
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
              ></Button>
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
              <Item.Header data-testid="status" as="h2" tabIndex="1">
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
