import React, { FC, useState } from "react";
import { IRoad } from "./types";
import { Popover, Button } from "antd";

type StatusProps = {
  road: IRoad;
};

const Status: FC<any> = (props: StatusProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { roadName } = props.road;

  const content = (
    <>
      <h1>Er {roadName} åpen eller stengt?</h1>
      <p>
        Basert på din lokasjon ser vi at du er nærmere enn 20km fra tunnelen. Så
        du vet kanskje hva som er riktig?
      </p>
      <p>Er {roadName} egentlig åpen?</p>
      <Button onClick={() => setOpen(false)}>Stengt</Button>
      <Button onClick={() => setOpen(false)}>Åpen</Button>
    </>
  );

  return (
    <Popover
      onOpenChange={(newOpen: boolean) => setOpen(newOpen)}
      open={open}
      content={content}
    >
      <Button>Er status feil?</Button>
    </Popover>
  );
};

export default Status;
