import React, { useState, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday, isPast } from "date-fns";
import { LABEL_OPTIONS } from "../data/labels";
import { USERS } from "../data/users";
import { ACTIONS } from "../reducers/boardsReducer";
import { BoardsContext } from "../context/BoardsProvider";

export default function TaskCard({ boardId, listId, task }) {
  const { dispatch } = useContext(BoardsContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [due, setDue] = useState(task.dueDate ? new Date(task.dueDate) : null);

  const save = () => {
    if (!title.trim()) return;
    dispatch({
      type: ACTIONS.EDIT_TASK,
      payload: {
        boardId,
        listId,
        taskId: task.id,
        updates: { title, description: desc },
      },
    });
    setOpen(false);
  };

  const remove = () => {
    if (!confirm("Delete?")) return;
    dispatch({
      type: ACTIONS.DELETE_TASK,
      payload: { boardId, listId, taskId: task.id },
    });
  };

  const toggleLabel = (label) => {
    if (task.labels?.includes(label)) {
      dispatch({
        type: ACTIONS.REMOVE_LABEL,
        payload: { boardId, listId, taskId: task.id, label },
      });
    } else {
      dispatch({
        type: ACTIONS.ADD_LABEL,
        payload: { boardId, listId, taskId: task.id, label },
      });
    }
  };

  const onDue = (d) => {
    setDue(d);
    dispatch({
      type: ACTIONS.SET_DUE_DATE,
      payload: {
        boardId,
        listId,
        taskId: task.id,
        dueDate: d ? d.toISOString() : null,
      },
    });
  };

  const toggleAssignee = (uid) => {
    if (task.assignees?.includes(uid)) {
      dispatch({
        type: ACTIONS.UNASSIGN_USER,
        payload: { boardId, listId, taskId: task.id, userId: uid },
      });
    } else {
      dispatch({
        type: ACTIONS.ASSIGN_USER,
        payload: { boardId, listId, taskId: task.id, userId: uid },
      });
    }
  };

  return (
    <div
      className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md card-shadow cursor-pointer"
      onClick={() => setOpen(true)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {task.labels?.map((l) => {
              const opt = LABEL_OPTIONS.find((x) => x.text === l);
              return (
                <span
                  key={l}
                  className={`px-2 py-0.5 rounded text-xs text-white ${
                    opt?.color || "bg-gray-500"
                  }`}
                >
                  {l}
                </span>
              );
            })}
          </div>
          <div className="font-medium">{task.title}</div>
          {task.description && (
            <div className="text-xs text-slate-500 dark:text-slate-300">
              {task.description}
            </div>
          )}
          {task.dueDate && (
            <div
              className={`text-xs mt-2 ${
                isPast(new Date(task.dueDate)) &&
                !isToday(new Date(task.dueDate))
                  ? "text-red-600"
                  : isToday(new Date(task.dueDate))
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              Due: {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="text-slate-500"
          >
            Edit
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-800 w-[min(720px,95%)] p-4 rounded-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Edit Card</h3>
              <div className="flex gap-2">
                <button onClick={remove} className="text-sm text-red-600">
                  Delete
                </button>
                <button onClick={() => setOpen(false)} className="text-sm">
                  Close
                </button>
              </div>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="border p-2 rounded w-full mb-2"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm mb-1">Labels</div>
                <div className="flex gap-2 flex-wrap">
                  {LABEL_OPTIONS.map((opt) => (
                    <label
                      key={opt.text}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={task.labels?.includes(opt.text)}
                        onChange={() => toggleLabel(opt.text)}
                      />
                      <span
                        className={`px-2 py-0.5 rounded text-white ${opt.color}`}
                      >
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm mb-1">Due Date</div>
                <DatePicker
                  selected={due}
                  onChange={onDue}
                  isClearable
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm mb-1">Assignees</div>
              <div className="flex gap-2">
                {USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => toggleAssignee(u.id)}
                    className={`px-2 py-1 rounded-md text-sm ${
                      task.assignees?.includes(u.id)
                        ? "bg-blue-600 text-white"
                        : "border"
                    }`}
                  >
                    {u.avatar} {u.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="px-3 py-1 rounded bg-blue-600 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
