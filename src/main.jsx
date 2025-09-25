import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { BoardsProvider } from "./context/BoardsProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BoardsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BoardsProvider>
  </React.StrictMode>
);
