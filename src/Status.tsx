import React, { useState, useEffect } from "react";
import { Modal, Button } from "semantic-ui-react";
import { useAuth0 } from "@auth0/auth0-react";
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

const StatusModal = (props: StatusModalProps) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  // const { lat, lon } = useLocation();

  const {
    open,
    setOpen,
    road: { urlFriendly, roadName, status },
  } = props;

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: { returnTo: `/${urlFriendly}/user-report` },
    });
  }

  // @todo: Get GPS coordinates for road from API
  // const distance = getDistance(0, 0, lat, lon);

  return (
    { isAuthenticated } && (
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
              Du vet kanskje hva som er riktig? Er {roadName} egentlig{" "}
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
    )
  );
};

const Status = (props: StatusProps) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.pathname === `/${props.road.urlFriendly}/user-report`) {
      setOpen(true);
    }
  }, [props.road.urlFriendly]);

  useEffect(() => {
    if (open) {
      window.history.replaceState(
        null,
        "Stengt tunnel",
        `/${props.road.urlFriendly}/user-report`
      );
    } else {
      if (window.location.pathname !== "/") {
        window.history.replaceState(null, "Stengt tunnel", "/");
      }
    }
  }, [open, props.road.urlFriendly]);

  return (
    <>
      {open && <StatusModal open={open} setOpen={setOpen} road={props.road} />}
      <Button onClick={() => setOpen(true)}>Er status feil?</Button>
    </>
  );
};
export default Status;
