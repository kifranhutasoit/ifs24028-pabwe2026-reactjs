import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAccessToken, putAccessToken, assetUrl, api } from "./apiHelper";

// Mock the global fetch and DELCOM_BASEURL
global.DELCOM_BASEURL = "https://example.com/api";
global.fetch = vi.fn();

describe("apiHelper", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("getAccessToken and putAccessToken", () => {
    it("should manage access token in localStorage", () => {
      expect(getAccessToken()).toBeNull();
      putAccessToken("my-token");
      expect(getAccessToken()).toBe("my-token");
      putAccessToken(null);
      expect(getAccessToken()).toBeNull();
    });
  });

  describe("assetUrl", () => {
    it("should return correct asset url", () => {
      expect(assetUrl("image.png")).toBe("https://example.com/image.png");
      expect(assetUrl(null)).toBeNull();
    });
  });

  describe("api", () => {
    it("should make a GET request and return data on success", async () => {
      const mockData = { id: 1, name: "test" };
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "success", data: mockData }),
      });

      const data = await api("/test");
      expect(fetch).toHaveBeenCalledWith("https://example.com/api/test", {
        method: "GET",
        headers: { Accept: "application/json" },
        body: undefined,
      });
      expect(data).toEqual(mockData);
    });

    it("should append query parameters correctly and filter empty ones", async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "success", data: "ok" }),
      });

      await api("/search", { query: { q: "hello", empty: "", nullVal: null, undefinedVal: undefined } });
      expect(fetch).toHaveBeenCalledWith("https://example.com/api/search?q=hello", expect.any(Object));
    });

    it("should include Authorization header if token exists", async () => {
      putAccessToken("secret-token");
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "success", data: "ok" }),
      });

      await api("/auth-test");
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/auth-test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer secret-token",
          }),
        })
      );
    });

    it("should send JSON body correctly", async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "success", data: "ok" }),
      });

      await api("/post", { method: "POST", body: { name: "test" } });
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/post",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({ name: "test" }),
        })
      );
    });

    it("should send FormData correctly", async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "success", data: "ok" }),
      });

      const form = new FormData();
      form.append("file", "test");
      await api("/upload", { method: "POST", form });
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/upload",
        expect.objectContaining({
          method: "POST",
          body: form,
        })
      );
    });

    it("should throw error if status is not success", async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "error", message: "API Error" }),
      });

      await expect(api("/error")).rejects.toThrow("API Error");
    });

    it("should throw default error message if status is not success and no message provided", async () => {
      fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ status: "error" }),
      });

      await expect(api("/error")).rejects.toThrow("Terjadi kesalahan");
    });
  });
});
