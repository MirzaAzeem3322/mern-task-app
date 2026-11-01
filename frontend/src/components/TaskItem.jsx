import { useState } from "react";

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const startEdit = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setEditing(true);
  };

  const save = async () => {
    if (!title.trim()) return;
    const ok = await onUpdate(task._id, {
      title: title.trim(),
      description: description.trim(),
    });
    if (ok) setEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) onDelete(task._id);
  };

  if (editing) {
    return (
      <li className="task-item editing">
        <div className="edit-fields">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            maxLength={200}
            autoFocus
            aria-label="Edit title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            maxLength={1000}
            aria-label="Edit description"
          />
        </div>
        <div className="actions">
          <button className="btn btn-primary" onClick={save} disabled={!title.trim()}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item ${task.completed ? "done" : ""}`}>
      <div className="task-body">
        <p className="task-title">{task.title}</p>
        {task.description && <p className="task-desc">{task.description}</p>}
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <div className="actions">
        <button
          className={`complete-toggle ${task.completed ? "is-done" : ""}`}
          onClick={() => onToggle(task)}
          title={task.completed ? "Click to mark as not completed" : "Click to mark as completed"}
        >
          {task.completed ? "✓ Completed" : "Mark as completed"}
        </button>
        <button className="btn btn-ghost" onClick={startEdit}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}
