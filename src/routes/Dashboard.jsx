import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsContext } from "../context/BoardsProvider";
import { exportStateJSON, parseImportedJSON } from "../utils/storage";

export default function Dashboard() {
  const { state, dispatch } = useContext(BoardsContext);
  const [name, setName] = useState("");
  const nav = useNavigate();
  const fileInput = React.createRef();

  const createBoard = () => {
    if (!name.trim()) return;
    dispatch({ type: "ADD_BOARD", payload: { name: name.trim() } });
    setName("");
  };
  const exportAll = () => {
    const url = exportStateJSON(state);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atm_export_${Date.now()}.json`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  const onFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const parsed = await parseImportedJSON(f);
    if (!parsed || !Array.isArray(parsed.boards)) return alert("Invalid file");
    if (!confirm("Overwrite current boards?")) return;
    dispatch({ type: "SET_STATE", payload: parsed });
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Board name"
          className="border p-2 rounded-md w-64"
        />
        <button
          onClick={createBoard}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Create Board
        </button>
        <button onClick={exportAll} className="border px-3 py-2 rounded-md">
          Export
        </button>
        <button
          onClick={() => fileInput.current.click()}
          className="border px-3 py-2 rounded-md"
        >
          Import
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          onChange={onFile}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {state.boards.length === 0 && (
          <div className="text-slate-500">No boards yet — create one.</div>
        )}
        {state.boards.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-800 p-4 rounded-lg card-shadow hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">{b.name}</div>
                <div className="text-sm text-slate-500">
                  {b.lists.length} lists
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => nav(`/board/${b.id}`)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Open
                </button>
                <button
                  onClick={() =>
                    dispatch({
                      type: "DELETE_BOARD",
                      payload: { boardId: b.id },
                    })
                  }
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
