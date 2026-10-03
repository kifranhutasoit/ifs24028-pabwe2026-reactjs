import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../helpers/apiHelper";

export const asyncGetAll = createAsyncThunk("lf/all", async (query) => (await api("/lost-founds", { query })).lost_founds);
export const asyncGetOne = createAsyncThunk("lf/one", async (id) => (await api(`/lost-founds/${id}`)).lost_found);
export const asyncAdd = createAsyncThunk("lf/add", (body) => api("/lost-founds", { method: "POST", body }));
export const asyncChange = createAsyncThunk("lf/change", ({ id, ...body }) => api(`/lost-founds/${id}`, { method: "PUT", body }));
export const asyncCover = createAsyncThunk("lf/cover", ({ id, file }) => {
  const form = new FormData();
  form.append("cover", file);
  return api(`/lost-founds/${id}/cover`, { method: "POST", form });
});
export const asyncDelete = createAsyncThunk("lf/delete", (id) => api(`/lost-founds/${id}`, { method: "DELETE" }));

const slice = createSlice({
  name: "lostFounds",
  initialState: { lostFounds: [], lostFound: null, isLostFound: false },
  extraReducers: (b) => {
    b.addCase(asyncGetAll.pending, (s) => { s.isLostFound = true; });
    b.addCase(asyncGetAll.fulfilled, (s, a) => { s.lostFounds = a.payload; s.isLostFound = false; });
    b.addCase(asyncGetAll.rejected, (s) => { s.isLostFound = false; });
    b.addCase(asyncGetOne.fulfilled, (s, a) => { s.lostFound = a.payload; });
  },
});
export default slice.reducer;
