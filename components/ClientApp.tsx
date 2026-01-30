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

    // Group tunnels by status (open/closed/warning)
    const openTunnels: string[] = [];
    const closedTunnels: string[] = [];
    const warningTunnels: string[] = [];

    favoriteTunnels.forEach((item) => {
      const roadName = item.road!.roadName;
      const status = item.status!.status;

      if (status === 'green') {
        openTunnels.push(roadName);
      } else if (status === 'red') {
        closedTunnels.push(roadName);
      } else {
        warningTunnels.push(roadName);
      }
    });

    // Generate title based on statuses
    let title = '';
    const parts: string[] = [];

    if (closedTunnels.length > 0) {
      if (closedTunnels.length === 1) {
        parts.push(`${closedTunnels[0]} er stengt`);
      } else {
        const last = closedTunnels[closedTunnels.length - 1];
        const others = closedTunnels.slice(0, -1).join(', ');
        parts.push(`${others} og ${last} er stengt`);
      }
    }

    if (warningTunnels.length > 0) {
      if (warningTunnels.length === 1) {
        parts.push(`${warningTunnels[0]} har varsler`);
      } else {
        const last = warningTunnels[warningTunnels.length - 1];
        const others = warningTunnels.slice(0, -1).join(', ');
        parts.push(`${others} og ${last} har varsler`);
      }
    }

    if (openTunnels.length > 0 && parts.length === 0) {
      // Only show open status if there are no closed/warning tunnels
      if (openTunnels.length === 1) {
        title = favoriteTunnels[0].status!.statusMessage;
      } else {
        const last = openTunnels[openTunnels.length - 1];
        const others = openTunnels.slice(0, -1).join(', ');
        parts.push(`${others} og ${last} ser ut til å være åpne`);
      }
    }

    if (parts.length > 0) {
      title = parts.join('. ');
    } else if (favoriteTunnels.length === 1) {
      title = favoriteTunnels[0].status!.statusMessage;
    } else {
      title = 'Stengt tunnel';
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
