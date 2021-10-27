import React, { useState, createContext, useContext } from "react";
import { IGPS } from "./types";

const defaultLocation = {
  lat: 0,
  lon: 0,
};

const LocationContext = createContext(defaultLocation);

export const useLocation = () => useContext(LocationContext);

const LocationContextProvider = (props: any) => {
  const [location, setLocation] = useState<IGPS>(defaultLocation);
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    setLocation({
      lat,
      lon,
    });
  });

  return (
    <LocationContext.Provider value={location}>
      {props.children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;
