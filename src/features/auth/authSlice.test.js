import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, { isAuthLogout, asyncLogin, asyncRegister, asyncMe } from "./authSlice";
import * as apiHelper from "../../helpers/apiHelper";

vi.mock("../../helpers/apiHelper", () => ({
  api: vi.fn(),
  getAccessToken: vi.fn(),
  putAccessToken: vi.fn(),
}));

describe("authSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("reducers", () => {
    it("should return the initial state", () => {
      apiHelper.getAccessToken.mockReturnValue("initial-token");
      // Since initial state uses getAccessToken at import time, we might need to rely on undefined state to test the slice defaults
      // We can just test that the reducer handles an unknown action
      expect(authReducer(undefined, { type: "unknown" })).toEqual({
        token: undefined, // Or whatever it was when module loaded, but we'll assume the structure is tested
        user: null,
      });
    });

    it("should handle isAuthLogout", () => {
      const initialState = { token: "token", user: { id: 1 } };
      const action = isAuthLogout();
      const state = authReducer(initialState, action);

      expect(state).toEqual({ token: null, user: null });
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith(null);
    });
  });

  describe("extraReducers", () => {
    it("should handle asyncLogin.fulfilled", () => {
      const initialState = { token: null, user: null };
      const action = { type: asyncLogin.fulfilled.type, payload: "new-token" };
      const state = authReducer(initialState, action);

      expect(state.token).toBe("new-token");
    });

    it("should handle asyncMe.fulfilled", () => {
      const initialState = { token: "token", user: null };
      const action = { type: asyncMe.fulfilled.type, payload: { id: 1, name: "user" } };
      const state = authReducer(initialState, action);

      expect(state.user).toEqual({ id: 1, name: "user" });
    });
  });

  describe("thunks", () => {
    it("asyncLogin should call api and putAccessToken", async () => {
      apiHelper.api.mockResolvedValue({ token: "test-token" });
      const dispatch = vi.fn();
      const thunk = asyncLogin({ email: "test@test.com", password: "pwd" });
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(apiHelper.api).toHaveBeenCalledWith("/auth/login", {
        method: "POST",
        body: { email: "test@test.com", password: "pwd" },
      });
      expect(apiHelper.putAccessToken).toHaveBeenCalledWith("test-token");
      expect(result.payload).toBe("test-token");
    });

    it("asyncRegister should call api", async () => {
      apiHelper.api.mockResolvedValue({ status: "success" });
      const dispatch = vi.fn();
      const body = { name: "test", email: "t@t.c", password: "p" };
      const thunk = asyncRegister(body);
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(apiHelper.api).toHaveBeenCalledWith("/auth/register", {
        method: "POST",
        body,
      });
      expect(result.payload).toEqual({ status: "success" });
    });

    it("asyncMe should call api and return user", async () => {
      apiHelper.api.mockResolvedValue({ user: { id: 1, name: "test" } });
      const dispatch = vi.fn();
      const thunk = asyncMe();
      
      const result = await thunk(dispatch, () => ({}), undefined);
      
      expect(apiHelper.api).toHaveBeenCalledWith("/users/me");
      expect(result.payload).toEqual({ id: 1, name: "test" });
    });
  });
});
