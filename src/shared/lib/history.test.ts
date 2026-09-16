import { describe, expect, it } from "vitest";
import { canRedo, canUndo, historyReducer, initHistory } from "./history";

describe("history core", () => {
  it("starts with only a present value", () => {
    const state = initHistory(1);
    expect(state).toEqual({ past: [], present: 1, future: [] });
    expect(canUndo(state)).toBe(false);
    expect(canRedo(state)).toBe(false);
  });

  it("push moves present to past and clears the future", () => {
    let state = initHistory("a");
    state = historyReducer(state, { type: "push", value: "b" });
    expect(state).toEqual({ past: ["a"], present: "b", future: [] });
    state = historyReducer(state, { type: "push", value: "c" });
    expect(state.past).toEqual(["a", "b"]);
    expect(state.present).toBe("c");
  });

  it("redo is discarded by a new push (branching)", () => {
    let state = initHistory("a");
    state = historyReducer(state, { type: "push", value: "b" });
    state = historyReducer(state, { type: "undo" });
    expect(canRedo(state)).toBe(true);
    state = historyReducer(state, { type: "push", value: "z" });
    expect(canRedo(state)).toBe(false);
    expect(state.present).toBe("z");
  });

  it("undo and redo restore exactly what was pushed", () => {
    let state = initHistory({ n: 0 });
    state = historyReducer(state, { type: "push", value: { n: 1 } });
    state = historyReducer(state, { type: "push", value: { n: 2 } });

    state = historyReducer(state, { type: "undo" });
    expect(state.present).toEqual({ n: 1 });
    state = historyReducer(state, { type: "undo" });
    expect(state.present).toEqual({ n: 0 });
    expect(canUndo(state)).toBe(false);

    state = historyReducer(state, { type: "redo" });
    expect(state.present).toEqual({ n: 1 });
    state = historyReducer(state, { type: "redo" });
    expect(state.present).toEqual({ n: 2 });
    expect(canRedo(state)).toBe(false);
  });

  it("replace updates the present without touching the stacks", () => {
    let state = initHistory("a");
    state = historyReducer(state, { type: "push", value: "b" });
    state = historyReducer(state, { type: "replace", value: "b2" });
    expect(state.past).toEqual(["a"]);
    expect(state.present).toBe("b2");
    expect(state.future).toEqual([]);
    state = historyReducer(state, { type: "undo" });
    expect(state.present).toBe("a");
    state = historyReducer(state, { type: "redo" });
    expect(state.present).toBe("b2");
  });

  it("undo and redo are no-ops on empty stacks", () => {
    const state = initHistory(7);
    expect(historyReducer(state, { type: "undo" })).toBe(state);
    expect(historyReducer(state, { type: "redo" })).toBe(state);
  });

  it("caps the past stack at 50 entries", () => {
    let state = initHistory(0);
    for (let i = 1; i <= 60; i += 1) {
      state = historyReducer(state, { type: "push", value: i });
    }
    expect(state.past).toHaveLength(50);
    expect(state.past[0]).toBe(10);
    expect(state.present).toBe(60);
  });
});
