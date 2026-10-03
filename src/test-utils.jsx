import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer from "./features/auth/authSlice";
import lostFoundsReducer from "./features/lost-founds/lostFoundSlice";

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer, lostFounds: lostFoundsReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
