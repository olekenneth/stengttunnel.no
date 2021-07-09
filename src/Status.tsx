import React, { FC, useEffect, useState } from "react";
import { IRoad, IRoadStatus, ISource } from "./types";
import { Card, Modal, Button, Loader, Header } from "semantic-ui-react";

type StatusProps = {
  road: IRoad;
};

const Status: FC<any> = (props: StatusProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { roadName } = props.road;

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Er status feil?</Button>}
    >
      <Modal.Header>Er {roadName} åpen eller stengt?</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Basert på din lokasjon ser vi at du er nærmere enn 20km fra
            tunnelen. Så du vet kanskje hva som er riktig?
          </p>
          <p>Er {roadName} egentlig åpen?</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setOpen(false)}>
          Stengt
        </Button>
        <Button positive onClick={() => setOpen(false)}>
          Åpen
        </Button>
      </Modal.Actions>
    </Modal>
  );
  return (
    <Card>
      <Card.Content>
        <Card.Header>Er status feil?</Card.Header>
        <Card.Meta>Nærheten av tunnelen</Card.Meta>

        <Card.Description></Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="ui two buttons">
          <Button basic color="green">
            Åpen
          </Button>
          <Button basic color="red">
            Stengt
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default Status;
