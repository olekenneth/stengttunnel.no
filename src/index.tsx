import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "semantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./App";
import LocationProvider from './LocationContext'


const onRedirectCallback = (appState: any) => {
  console.log(appState, window.location.pathname);
  // window.history.push(
  //   appState && appState.returnTo ? appState.returnTo : window.location.pathname
  // );
};

const providerConfig = {
  domain: "stengttunnel.eu.auth0.com",
  clientId: "lB8xWOACj3oVrIm80jGrRGcFkFv192Km",
  redirectUri: window.location.origin,
  onRedirectCallback,
};

ReactDOM.render(
  <React.StrictMode>
        <Auth0Provider {...providerConfig}>
    <LocationProvider>
        <App />
    </LocationProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
