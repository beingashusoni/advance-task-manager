import React, { useContext, useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { ACTIONS } from "../reducers/boardsReducer";
import { BoardsContext } from "../context/BoardsProvider";

export default function ListColumn({ boardId, list }) {
  const { dispatch } = useContext(BoardsContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(list.name);
  const [taskTitle, setTaskTitle] = useState("");

  const saveName = () => {
    if (!name.trim()) return;
    dispatch({
      type: ACTIONS.RENAME_LIST,
      payload: { boardId, listId: list.id, name },
    });
    setEditing(false);
  };

  const add = () => {
    if (!taskTitle.trim()) return;
    dispatch({
      type: ACTIONS.ADD_TASK,
      payload: { boardId, listId: list.id, title: taskTitle.trim() },
    });
    setTaskTitle("");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg min-w-[280px] max-w-[320px] h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        {editing ? (
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-1 rounded-md"
            />
            <button
              onClick={saveName}
              className="bg-blue-600 text-white px-2 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-sm">{list.name}</h3>
            <div className="flex gap-2 text-xs">
              <button onClick={() => setEditing(true)}>Rename</button>
              <button
                onClick={() =>
                  dispatch({
                    type: ACTIONS.DELETE_LIST,
                    payload: { boardId, listId: list.id },
                  })
                }
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <Droppable droppableId={list.id} type="TASK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-3 min-h-[80px] ${
              snapshot.isDraggingOver ? "bg-slate-50 dark:bg-slate-700" : ""
            }`}
          >
            {list.tasks.map((t, i) => (
              <Draggable draggableId={t.id} index={i} key={t.id}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    <TaskCard boardId={boardId} listId={list.id} task={t} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-3">
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Add a card..."
          className="border p-2 rounded-md w-full"
        />
        <div className="mt-2 flex gap-2">
          <button
            onClick={add}
            className="bg-indigo-600 text-white px-3 py-1 rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
