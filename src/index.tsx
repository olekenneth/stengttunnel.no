import React from "react";
import { createRoot } from "react-dom/client";
import "fomantic-ui-css/semantic.min.css";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
