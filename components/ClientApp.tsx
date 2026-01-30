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
  const [statuses, setStatuses] = useState<{ [key: string]: IRoadStatus }>(initialStatuses);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const roadFromPath = initialPath;

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
  }, [roads, initialPath]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch and update status for favorite tunnels
  useEffect(() => {
    if (typeof window === 'undefined' || favorites.length === 0) return;

    const updateStatuses = async () => {
      const newStatuses: { [key: string]: IRoadStatus } = { ...statuses };

      // Fetch status for each favorite
      await Promise.all(
        favorites.map(async (urlFriendly) => {
          const road = roads.find((r) => r.urlFriendly === urlFriendly);
          if (!road) return;

          try {
            const response = await fetch(road.url);
            if (response.ok) {
              const status = await response.json();
              newStatuses[urlFriendly] = status;
            }
          } catch (error) {
            console.error(`Failed to fetch status for ${urlFriendly}:`, error);
          }
        })
      );

      setStatuses(newStatuses);
    };

    updateStatuses();
  }, [favorites, roads]);

  // Update document title and meta tags based on favorite tunnels' statuses
  useEffect(() => {
    if (typeof window === 'undefined' || favorites.length === 0) {
      if (typeof window !== 'undefined') {
        document.title = 'Stengt tunnel';
      }
      return;
    }

    // Get road names and statuses for favorites
    const favoriteTunnels = favorites
      .map((urlFriendly) => {
        const road = roads.find((r) => r.urlFriendly === urlFriendly);
        const status = statuses[urlFriendly];
        return { road, status };
      })
      .filter((item) => item.road && item.status);

    if (favoriteTunnels.length === 0) return;

    // Generate title based on number of favorites
    let title = '';

    if (favoriteTunnels.length === 1) {
      // For single tunnel: show status message
      title = favoriteTunnels[0].status!.statusMessage;
    } else {
      // For multiple tunnels: show only tunnel names
      const tunnelNames = favoriteTunnels.map((item) => item.road!.roadName);

      if (tunnelNames.length === 2) {
        title = `${tunnelNames[0]} og ${tunnelNames[1]}`;
      } else {
        const last = tunnelNames[tunnelNames.length - 1];
        const others = tunnelNames.slice(0, -1).join(', ');
        title = `${others} og ${last}`;
      }
    }

    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', title);
    }

    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
  }, [favorites, statuses, roads]);

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
