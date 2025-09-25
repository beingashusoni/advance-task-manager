import React, { useContext, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BoardsContext } from "../context/BoardsProvider";
import ListColumn from "../components/ListColumn";
import { DragDropContext } from "@hello-pangea/dnd";
import { ACTIONS } from "../reducers/boardsReducer";

export default function BoardView() {
  const { boardId } = useParams();
  const { state, dispatch } = useContext(BoardsContext);
  const board = useMemo(
    () => state.boards.find((b) => b.id === boardId),
    [state, boardId]
  );
  const [newList, setNewList] = useState("");
  const [query, setQuery] = useState("");

  if (!board)
    return (
      <div>
        Board not found — <Link to="/">Go back</Link>
      </div>
    );

  const onDragEnd = (res) => {
    if (!res.destination) return;
    const { source, destination } = res;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    dispatch({
      type: ACTIONS.MOVE_TASK,
      payload: {
        boardId,
        fromListId: source.droppableId,
        toListId: destination.droppableId,
        fromIndex: source.index,
        toIndex: destination.index,
      },
    });
  };

  const filtered = board.lists.map((l) => ({
    ...l,
    tasks: l.tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(query.toLowerCase())
    ),
  }));

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-slate-500">
              ← Back
            </Link>
            <h2 className="text-2xl font-bold">{board.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="border p-2 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            placeholder="New list name"
            className="border p-2 rounded-md"
          />
          <button
            onClick={() => {
              if (!newList.trim()) return;
              dispatch({
                type: ACTIONS.ADD_LIST,
                payload: { boardId, name: newList.trim() },
              });
              setNewList("");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Add List
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-6">
            {filtered.map((list) => (
              <ListColumn key={list.id} boardId={boardId} list={list} />
            ))}
          </div>
        </DragDropContext>
      </div>

      <aside className="w-80 hidden lg:block">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg card-shadow">
          <h4 className="font-semibold mb-3">Activity</h4>
          <ul className="text-sm space-y-2 max-h-[60vh] overflow-auto">
            {(board.activity || []).map((a) => (
              <li key={a.id} className="border-b pb-1">
                <div className="text-sm">{a.message}</div>
                <div className="text-xs text-slate-500">
                  {new Date(a.time).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
