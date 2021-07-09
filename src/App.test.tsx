import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders stengt tunnel", () => {
  render(<App />);
  const el = screen.getByText(/Stengt tunnel/i);
  expect(el).toBeInTheDocument();
});
