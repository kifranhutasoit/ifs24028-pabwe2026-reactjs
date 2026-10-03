import { describe, it, expect, vi, beforeEach } from "vitest";
import lostFoundReducer, { asyncGetAll, asyncGetOne, asyncAdd, asyncChange, asyncCover, asyncDelete } from "./lostFoundSlice";
import * as apiHelper from "../../helpers/apiHelper";

vi.mock("../../helpers/apiHelper", () => ({
  api: vi.fn(),
}));

describe("lostFoundSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("reducers", () => {
    it("should return the initial state", () => {
      expect(lostFoundReducer(undefined, { type: "unknown" })).toEqual({
        lostFounds: [],
        lostFound: null,
        isLostFound: false,
      });
    });
  });

  describe("extraReducers", () => {
    it("should handle asyncGetAll.pending", () => {
      const action = { type: asyncGetAll.pending.type };
      const state = lostFoundReducer(undefined, action);
      expect(state.isLostFound).toBe(true);
    });

    it("should handle asyncGetAll.fulfilled", () => {
      const initialState = { lostFounds: [], isLostFound: true };
      const action = { type: asyncGetAll.fulfilled.type, payload: [{ id: 1 }] };
      const state = lostFoundReducer(initialState, action);
      expect(state.lostFounds).toEqual([{ id: 1 }]);
      expect(state.isLostFound).toBe(false);
    });

    it("should handle asyncGetAll.rejected", () => {
      const initialState = { lostFounds: [], isLostFound: true };
      const action = { type: asyncGetAll.rejected.type };
      const state = lostFoundReducer(initialState, action);
      expect(state.isLostFound).toBe(false);
    });

    it("should handle asyncGetOne.fulfilled", () => {
      const initialState = { lostFound: null };
      const action = { type: asyncGetOne.fulfilled.type, payload: { id: 1 } };
      const state = lostFoundReducer(initialState, action);
      expect(state.lostFound).toEqual({ id: 1 });
    });
  });

  describe("thunks", () => {
    it("asyncGetAll should call api", async () => {
      apiHelper.api.mockResolvedValue({ lost_founds: [{ id: 1 }] });
      const dispatch = vi.fn();
      const thunk = asyncGetAll({ is_resolved: true });
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds", { query: { is_resolved: true } });
      expect(result.payload).toEqual([{ id: 1 }]);
    });

    it("asyncGetOne should call api", async () => {
      apiHelper.api.mockResolvedValue({ lost_found: { id: 1 } });
      const dispatch = vi.fn();
      const thunk = asyncGetOne("123");
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds/123");
      expect(result.payload).toEqual({ id: 1 });
    });

    it("asyncAdd should call api", async () => {
      apiHelper.api.mockResolvedValue({ status: "success" });
      const dispatch = vi.fn();
      const thunk = asyncAdd({ title: "test" });
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds", { method: "POST", body: { title: "test" } });
    });

    it("asyncChange should call api", async () => {
      apiHelper.api.mockResolvedValue({ status: "success" });
      const dispatch = vi.fn();
      const thunk = asyncChange({ id: "123", title: "updated" });
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds/123", { method: "PUT", body: { title: "updated" } });
    });

    it("asyncCover should call api with FormData", async () => {
      apiHelper.api.mockResolvedValue({ status: "success" });
      const dispatch = vi.fn();
      const file = new File([""], "test.png", { type: "image/png" });
      const thunk = asyncCover({ id: "123", file });
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds/123/cover", {
        method: "POST",
        form: expect.any(FormData),
      });
      // We can't easily assert the contents of FormData in jest without custom matchers, but we ensure form property is passed.
    });

    it("asyncDelete should call api", async () => {
      apiHelper.api.mockResolvedValue({ status: "success" });
      const dispatch = vi.fn();
      const thunk = asyncDelete("123");
      const result = await thunk(dispatch, () => ({}), undefined);
      expect(apiHelper.api).toHaveBeenCalledWith("/lost-founds/123", { method: "DELETE" });
    });
  });
});
