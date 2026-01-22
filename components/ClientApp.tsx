'use client'

import { useEffect, useState } from "react";
import { Message, Segment, Menu } from "semantic-ui-react";
import Header from "./Header";
import { IRoad, IFavorite, IRoadStatus } from "@/lib/types";
import Roads from "./Roads";

type ClientAppProps = {
  roads: IRoad[];
  initialStatuses: { [key: string]: IRoadStatus };
  initialPath?: string;
};

const ClientApp = ({ roads, initialStatuses, initialPath }: ClientAppProps) => {
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const roadFromPath = initialPath;

    Promise.resolve(localStorage.getItem("favorites") || "[]")
      .then((r) => JSON.parse(r))
      .then((storedFavorites) => {
        if (roadFromPath && roads.find((r) => r.urlFriendly === roadFromPath)) {
          if (storedFavorites.indexOf(roadFromPath) === -1) {
            storedFavorites.push(roadFromPath);
          }
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, "Stengt tunnel", "/");
          }
        } else if (roadFromPath && roads.length > 0) {
          setAlert("Finner ikke tunnelen eller veien '" + roadFromPath + "'");
        }
        return storedFavorites;
      })
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, [roads, initialPath]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <>
      <Segment inverted>
        <Menu inverted secondary style={{ margin: "0 auto", maxWidth: "640px" }}>
          <Menu.Item>
            <img
              width="35"
              height="35"
              alt="Stengt tunnel logo"
              src="/images/stengttunnel-logo.png"
            />
          </Menu.Item>
          <Menu.Item header>
            <h1>Stengt tunnel</h1>
          </Menu.Item>
        </Menu>
      </Segment>
      <div className="App" style={{ margin: "15px auto", maxWidth: "640px" }}>
        {alert && (
          <Message
            negative
            onDismiss={() => {
              setAlert(null);
              if (typeof window !== 'undefined') {
                window.history.replaceState(null, "Stengt tunnel", "/");
              }
            }}
          >
            <Message.Header>404 Finner ikke siden</Message.Header>
            <p>{alert}</p>
          </Message>
        )}
        <Header roads={roads} favorites={favorites} setFavorites={setFavorites} />
        <Roads favorites={favorites} roads={roads} initialStatuses={initialStatuses} />
      </div>
    </>
  );
};

export default ClientApp;
