import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/auth/authSlice";
import lostFounds from "./features/lost-founds/lostFoundSlice";

export const store = configureStore({ reducer: { auth, lostFounds } });
