import React, { useEffect, useState } from "react";
import { Message, Segment, Menu } from "semantic-ui-react";
import "./App.css";
import Header from "./Header";
import { IRoad, IFavorite } from "./types";
import Roads from "./Roads";

const App = () => {
  const [roads, setRoads] = useState<IRoad[]>([]);
  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://api.stengttunnel.no/roads.json", {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: IRoad[]) => {
        // Filter out invalid entries (e.g. lowercase-named placeholder
        // rows from the API) and sort alphabetically with Norwegian
        // collation so the dropdown is predictable. Oslofjordtunnelen
        // is pinned to the top as the site's flagship tunnel.
        const PINNED = ["oslofjordtunnelen"];
        const cleaned = data.filter(
          (r) => r.roadName && /^[A-ZÆØÅ]/.test(r.roadName)
        );
        const pinned = PINNED.map((p) =>
          cleaned.find((r) => r.urlFriendly === p)
        ).filter(Boolean) as IRoad[];
        const rest = cleaned
          .filter((r) => !PINNED.includes(r.urlFriendly))
          .sort((a, b) => a.roadName.localeCompare(b.roadName, "nb-NO"));
        setRoads([...pinned, ...rest]);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          // Keep silent in UI; the dropdown loading state still indicates
          // unavailability. Log for debugging.
          // eslint-disable-next-line no-console
          console.error("Failed to load roads.json", err);
        }
      });

    return () => {
      controller.abort();
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
