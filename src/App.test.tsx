import React from "react";
import user from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  const makeFetchResponse = async (value) => ({ json: async () => value });
  const mockFetch = jest
    .fn()
    .mockReturnValueOnce(
      makeFetchResponse([
        {
          roadName: "Oslofjordtunnelen",
          urlFriendly: "oslofjordtunnelen",
          url: "https://api.stengttunnel.no/oslofjordtunnelen/status.json",
        },
        {
          roadName: "Atlanterhavstunnelen",
          urlFriendly: "atlanterhavstunnelen",
          url: "https://api.stengttunnel.no/atlanterhavstunnelen/status.json",
        },
        {
          roadName: "Blindheimstunnelen",
          urlFriendly: "blindheimstunnelen",
          url: "https://api.stengttunnel.no/blindheimstunnelen/status.json",
        },
      ])
    )
    .mockReturnValueOnce(
      makeFetchResponse({
        messages: [],
        status: "green",
        statusMessage: "Tunnelen ser ut til å være åpen.",
        statusCode: 10,
      })
    );
  global.fetch = mockFetch;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("Render app with Stengt tunnel in header", async () => {
  render(<App />);

  await waitFor(() => screen.getByText(/Stengt tunnel/i));
});

test("Search for Oslofjordtunnelen and get status", async () => {
  render(<App />);

  await waitFor(() => screen.getByRole(/combobox/i));
  const dropdown = screen.getByRole(/combobox/i);
  await user.click(dropdown);
  await user.type(dropdown.querySelector("input"), "Oslofjord");
  await waitFor(() => screen.getByText(/Oslofjordtunnelen/i));
  const label = screen.getByText(/Oslofjordtunnelen/i);
  await user.click(label);

  await waitFor(() => screen.getByRole(/road/i));
  expect(screen.getByRole("status")).toHaveTextContent(
    /Oslofjordtunnelen (ser ut|er kanskje)/
  );
});
