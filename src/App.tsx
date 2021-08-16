import React, { FC, useEffect, useState } from "react";
import { Message } from "semantic-ui-react";
import "./App.css";
import Header from "./Header";
import { IRoad, IFavorite } from "./types";
import Road from "./Road";
import Ad from "./Ad";

const App: FC<any> = () => {
  const [roads, setRoads] = useState<IRoad[]>([]);
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [alert, setAlert] = useState<String | null>(null);

  useEffect(() => {
    fetch("https://stengttunnel.no/roads.json")
      .then((r) => r.json())
      .then(setRoads);
  }, []);

  useEffect(() => {
    const [, roadFromPath] = window.location.pathname.split("/");

    Promise.resolve(localStorage.getItem("favorites") || "[]")
      .then((r) => JSON.parse(r))
      .then((storedFavorites) => {
        if (
          roadFromPath &&
          storedFavorites.indexOf(roadFromPath) === -1 &&
          roads.find((r) => r.urlFriendly === roadFromPath)
        ) {
          window.history.replaceState(null, "Stengt tunnel", "/");
          storedFavorites.push(roadFromPath);
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
      <div style={{ margin: "15px auto", maxWidth: "640px" }}>
        <Header
          roads={roads}
          favorites={favorites}
          setFavorites={setFavorites}
        />
        {roads
          .filter((r) => favorites.indexOf(r.urlFriendly) !== -1)
          .reverse()
          .map((r, i) => (
            <div key={`container-${r.urlFriendly}`}>
              <Road road={r} />
              <Ad />
            </div>
          ))}
      </div>
    </>
  );
};

export default App;
