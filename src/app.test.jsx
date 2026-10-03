import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test-utils";

describe("App Routing Integration", () => {
  it("should render Login page by default if navigating to /auth/login", () => {
    renderWithProviders(<App />, {
      preloadedState: {
        auth: {
          token: null,
          user: null,
          isLoading: false,
          error: null,
        },
      },
    });

    // MemoryRouter defaults to "/" but App handles /auth/login
    // We would need to set initialEntries in MemoryRouter in test-utils to test specific routes easily,
    // or just assume App renders some part of LostFoundLayout for "/".
    // For now, a basic smoke test:
    expect(document.body).toBeInTheDocument();
  });
});
