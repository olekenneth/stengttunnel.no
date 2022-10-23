import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import ReactGA from "react-ga";
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

    // ReactGA.initialize("UA-8420880-19", {
    //   testMode: process.env.NODE_ENV === "test",
    //   debug: process.env.NODE_ENV === "development",
    // });
    // ReactGA.pageview("/");

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

  const error = (msg: String) => {
    return message.error("404 - Finner ikke siden" + msg);
  };

  if (alert) {
    error(alert).then(() => {
      setAlert(null);
      window.history.replaceState(null, "Stengt tunnel", "/");
    });
  }

  return (
    <>
      <Card style={{ margin: "0 auto", maxWidth: "640px" }}>
        <img alt="Stengt tunnel logo" src="/images/stengttunnel-logo.png" />
        <h1>Stengt tunnel</h1>
      </Card>
      <div style={{ margin: "15px auto", maxWidth: "640px" }}>
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
