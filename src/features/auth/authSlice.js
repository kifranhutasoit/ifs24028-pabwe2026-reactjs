import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api, getAccessToken, putAccessToken } from "../../helpers/apiHelper";

export const asyncLogin = createAsyncThunk("auth/login", async (body) => {
  const d = await api("/auth/login", { method: "POST", body });
  putAccessToken(d.token);
  return d.token;
});
export const asyncRegister = createAsyncThunk("auth/register", (body) => api("/auth/register", { method: "POST", body }));
export const asyncMe = createAsyncThunk("auth/me", async () => (await api("/users/me")).user);

const slice = createSlice({
  name: "auth",
  initialState: { token: getAccessToken(), user: null },
  reducers: {
    isAuthLogout(state) { putAccessToken(null); state.token = null; state.user = null; },
  },
  extraReducers: (b) => {
    b.addCase(asyncLogin.fulfilled, (s, a) => { s.token = a.payload; });
    b.addCase(asyncMe.fulfilled, (s, a) => { s.user = a.payload; });
  },
});
export const { isAuthLogout } = slice.actions;
export default slice.reducer;
