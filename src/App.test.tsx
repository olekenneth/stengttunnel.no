import React from "react";
import user from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("Render app with Stengt tunnel in header", async () => {
  render(<App />);

  await waitFor(() => screen.getByText(/Stengt tunnel/i));
});

test("Search for Oslofjordtunnelen and get status", async () => {
  render(<App />);

  await waitFor(() => screen.getByRole(/combobox/i));
  const dropdown = screen.getByRole(/combobox/i);
  user.click(dropdown);
  user.type(dropdown.querySelector("input") as Element, "Oslofjord");

  await waitFor(() => screen.getByText(/Oslofjordtunnelen/i));
  const label = screen.getByText(/Oslofjordtunnelen/i);
  user.click(label);

  await waitFor(() => screen.getByRole(/road/i));
  expect(screen.getByRole("status")).toHaveTextContent(
    /Oslofjordtunnelen (ser ut|er kanskje)/
  );
});
