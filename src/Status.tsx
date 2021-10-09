import React, { FC, useState } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
// import { useLocation } from "./LocationContext";
// import { getDistance } from "./utils";

import { IRoad } from "./types";

type StatusModalProps = {
  road: IRoad;
  open: boolean;
  setOpen: (f: boolean) => void;
};

type StatusProps = {
  road: IRoad;
};

const StatusModal = withAuthenticationRequired(
  (props: StatusModalProps) => {
    const { user } = useAuth0();
    // const { lat, lon } = useLocation();

    const {
      open,
      setOpen,
      road: { roadName, status },
    } = props;

    // @todo: Get GPS coordinates for road from API
    // const distance = getDistance(0, 0, lat, lon);

    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
      >
        <Modal.Header>Er {roadName} åpen eller stengt?</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <h3>Hei {user && user.name}!</h3>
            <p>
              Du vet kanskje var som er riktig? Er {roadName} egentlig{" "}
              {status === "green" ? "stengt" : "åpen"}?
            </p>
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
  },
  {
    onRedirecting: () => (
      <Modal open={true}>
        <Modal.Header>Logger inn...</Modal.Header>
      </Modal>
    ),
  }
);

const Status: FC<any> = (props: StatusProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      {open && <StatusModal open={open} setOpen={setOpen} road={props.road} />}
      <Button onClick={() => setOpen(true)}>Er status feil?</Button>
    </>
  );
};
export default Status;
