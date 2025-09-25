import React, { createContext, useReducer, useEffect } from "react";
import { boardsReducer, initialState } from "../reducers/boardsReducer";
import { loadState, saveState } from "../utils/storage";

export const BoardsContext = createContext();
export function BoardsProvider({ children }) {
  const [state, dispatch] = useReducer(
    boardsReducer,
    initialState,
    () => loadState() || initialState
  );
  useEffect(() => saveState(state), [state]);
  return (
    <BoardsContext.Provider value={{ state, dispatch }}>
      {children}
    </BoardsContext.Provider>
  );
}
