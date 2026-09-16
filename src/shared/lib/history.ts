/**
 * Undo/redo history core for tool state. Pure functions so the semantics are
 * unit-testable without React or DOM.
 */

export const HISTORY_LIMIT = 50;

export type HistoryState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export type HistoryAction<T> =
  { type: "push"; value: T } | { type: "replace"; value: T } | { type: "undo" } | { type: "redo" };

export function initHistory<T>(present: T): HistoryState<T> {
  return { past: [], present, future: [] };
}

export function historyReducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>,
): HistoryState<T> {
  switch (action.type) {
    case "push":
      return {
        past: [...state.past, state.present].slice(-HISTORY_LIMIT),
        present: action.value,
        future: [],
      };
    case "replace":
      // Update the present without touching the stacks; used to coalesce
      // continuous input (slider drags) into a single undo step.
      return { ...state, present: action.value };
    case "undo": {
      if (state.past.length === 0) return state;
      return {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future],
      };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      return {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1),
      };
    }
  }
}

export function canUndo<T>(state: HistoryState<T>): boolean {
  return state.past.length > 0;
}

export function canRedo<T>(state: HistoryState<T>): boolean {
  return state.future.length > 0;
}
