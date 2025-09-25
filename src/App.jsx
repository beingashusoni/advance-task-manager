import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import BoardView from "./routes/BoardView";
import { loadState } from "./utils/storage";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold card-shadow">
              📃
            </div>
            <div>
              <div className="text-lg font-semibold">Advanced Task Manager</div>
              <div className="text-xs text-slate-500 dark:text-slate-300">
                By - Ashutosh Soni
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="px-3 py-1 rounded-md border"
            >
              Toggle Theme
            </button>
            {/* <a href="#" className="px-3 py-1 rounded-md text-sm bg-blue-600 text-white">New Project</a> */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board/:boardId" element={<BoardView />} />
        </Routes>
      </main>
    </div>
  );
}
