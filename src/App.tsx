import React, { useEffect, useState } from "react";
import { Message, Segment, Menu } from "semantic-ui-react";
import "./App.css";
import Header from "./Header";
import { IRoad, IFavorite } from "./types";
import Roads from "./Roads";

const App = () => {
  const [roads, setRoads] = useState<IRoad[]>([]);
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [alert, setAlert] = useState<String | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch("https://api.stengttunnel.no/roads.json")
      .then((r) => r.json())
      .then((data) => {
        if (isMounted) {
          setRoads(data);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const [, roadFromPath] = window.location.pathname.split("/");

    Promise.resolve(localStorage.getItem("favorites") || "[]")
      .then((r) => JSON.parse(r))
      .then((storedFavorites) => {
        if (roadFromPath && roads.find((r) => r.urlFriendly === roadFromPath)) {
          if (storedFavorites.indexOf(roadFromPath) === -1) {
            storedFavorites.push(roadFromPath);
          }
          window.history.replaceState(null, "Stengt tunnel", "/");
        } else if (roadFromPath && roads.length > 0) {
          setAlert("Finner ikke tunnelen eller veien '" + roadFromPath + "'");
        }
        return storedFavorites;
      })
      .then(setFavorites)
      .catch(() => setFavorites([]));
  }, [roads]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <>
      <Segment inverted>
        <Menu
          inverted
          secondary
          style={{ margin: "0 auto", maxWidth: "640px" }}
        >
          <Menu.Item>
            <img
              width="35"
              height="35"
              alt="Stengt tunnel logo"
              src="/images/stengttunnel-logo.png"
            />
          </Menu.Item>
          <Menu.Item header><h1>Stengt tunnel</h1></Menu.Item>
        </Menu>
      </Segment>
      <div style={{ margin: "15px auto", maxWidth: "640px" }}>
        {alert && (
          <Message
            negative
            onDismiss={() => {
              setAlert(null);
              window.history.replaceState(null, "Stengt tunnel", "/");
            }}
          >
            <Message.Header>404 Finner ikke siden</Message.Header>
            <p>{alert}</p>
          </Message>
        )}
        <Header
          roads={roads}
          favorites={favorites}
          setFavorites={setFavorites}
        />
        <Roads favorites={favorites} roads={roads} />
      </div>
    </>
  );
};

export default App;
