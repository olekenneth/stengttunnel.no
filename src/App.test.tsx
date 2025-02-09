import user from "@testing-library/user-event";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { act } from "react";

import App from "./App";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Invalid prop `%s` supplied to `React.Fragment`/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

beforeEach(() => {
  const makeFetchResponse = async (value: any) => ({ json: async () => value });
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
      ]),
    )
    .mockReturnValueOnce(
      makeFetchResponse({
        messages: [],
        status: "green",
        statusMessage: "Tunnelen ser ut til å være åpen.",
        statusCode: 10,
      }),
    );
  global.fetch = mockFetch;
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("Render app with Stengt tunnel in header", async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => screen.getByText(/Stengt tunnel/i));
});

test("Search for Oslofjordtunnelen and get status", async () => {
  await act(async () => {
    render(<App />);
  });

  await waitFor(() => screen.getByRole("combobox"));
  const dropdown = screen.getByRole("combobox");
  fireEvent.click(dropdown);

  await user.type(
    dropdown.querySelector("input") as HTMLInputElement,
    "Oslofjord",
  );
  await waitFor(() => screen.getByText(/Oslofjordtunnelen/i));
  const label = screen.getByText(/Oslofjordtunnelen/i);
  fireEvent.click(label);

  await waitFor(() => screen.getByTestId(/road/i));
  expect(screen.getByTestId("status")).toHaveTextContent(
    /Oslofjordtunnelen (ser ut|er kanskje)/,
  );
});
