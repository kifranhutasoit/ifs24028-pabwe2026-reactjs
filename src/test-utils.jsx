import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/states/authSlice';
import userReducer from './features/users/states/userSlice';
import lostFoundReducer from './features/lost-founds/states/lostFoundSlice';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: { auth: authReducer, users: userReducer, lostFounds: lostFoundReducer },
      preloadedState,
    }),
    ...rtlOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...rtlOptions }) };
}