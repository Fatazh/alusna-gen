import { useCallback, useMemo, useReducer } from "react";
import { canRedo, canUndo, historyReducer, initHistory } from "./history";

/**
 * State slot with undo/redo semantics. Mirrors the pattern already used in
 * ExperimentModule (push on every mutation, capped stack) as a reusable hook.
 */
export function useHistoryState<T>(initial: () => T) {
  const [state, dispatch] = useReducer(historyReducer<T>, undefined, () => initHistory(initial()));

  const push = useCallback((value: T) => dispatch({ type: "push", value }), []);
  const replacePresent = useCallback((value: T) => dispatch({ type: "replace", value }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);

  const canUndoNow = useMemo(() => canUndo(state), [state]);
  const canRedoNow = useMemo(() => canRedo(state), [state]);

  return {
    value: state.present,
    push,
    replacePresent,
    undo,
    redo,
    canUndo: canUndoNow,
    canRedo: canRedoNow,
  };
}
