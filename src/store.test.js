import { store } from "./store";

describe("Redux Store", () => {
  it("should configure the store with auth and lostFounds reducers", () => {
    const state = store.getState();
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("lostFounds");
  });
});
