import React, { FC, useEffect, useState } from "react";
import { IRoad, IRoadStatus, ISource } from "./types";
import Status from "./Status";
import {
  Card,
  Feed,
  Popup,
  Item,
  Button,
  Placeholder,
} from "semantic-ui-react";

type RoadProps = {
  road: IRoad;
};

const Road: FC<any> = (props: RoadProps) => {
  const [road, setRoad] = useState<IRoadStatus>();
  const { roadName } = props.road;

  useEffect(() => {
    fetch(props.road.url)
      .then((r) => r.json())
      .then((r) => {
        return {
          ...r,
          ...props.road,
        };
      })
      .then(setRoad);
  }, [props.road]);

  if (!road) {
    return (
      <Card fluid>
        <Card.Content>
          <Item.Header as="h2">{roadName}</Item.Header>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line length="full" />
              <Placeholder.Line length="medium" />
              <Placeholder.Line />
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
          </Placeholder>
        </Card.Content>
        <Card.Content extra>
          <Placeholder>
            <Placeholder.Paragraph>
              <Placeholder.Line length="full" />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line length="full" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
      </Card>
    );
  }
  const { status, messages, statusMessage } = road!;

  const image = `https://stengttunnel.no/status/${status}.png`;
  const messageFeed = messages.map((message, index) => {
    const df = new Intl.DateTimeFormat(
      ["nb-no", "da", "sv", "en-us", "en-gb"],
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const times = `${df.format(new Date(message.validFrom))} - ${df.format(
      new Date(message.validTo)
    )}`;
    return (
      <Feed.Event key={"message-" + index}>
        <Popup
          trigger={
            message.source === ISource.StatensVegvesen ? (
              <Feed.Label image="/vv_logo.png" />
            ) : (
              <Feed.Label icon="user outline" />
            )
          }
          content={message.source}
          inverted
        />
        <Feed.Content>
          <Feed.Date content={times} />
          <Feed.Summary>{message.message}</Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    );
  });

  const share = async () => {
    let shareNavigator = window.navigator as any;
    if (shareNavigator.clipboard) {
      await window.navigator.clipboard.writeText(
        window.location.href + "/veien"
      );
    }
    if (shareNavigator.share) {
      await window.navigator.share({
        title: "Stengttunnel",
        text: statusMessage,
        url: window.location.href + "/veieeeen",
      });
    }
  };

  return (
    <Card fluid>
      <Card.Content>
        <Item.Group>
          <Popup
            on={["click"]}
            trigger={
              <Button
                onClick={share}
                style={{ position: "absolute", right: "10px" }}
                icon="external share"
                circular
                basic
              ></Button>
            }
            content="Kopiert linken"
            inverted
          />
          <Item floated="left" style={{ margin: 0 }}>
            <Item.Image style={{ width: "auto" }} size="tiny" src={image} />
            <Item.Content verticalAlign="middle">
              <Item.Header as="h2">{statusMessage}</Item.Header>
              <Item.Extra>
                <Status road={road} />
              </Item.Extra>
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
