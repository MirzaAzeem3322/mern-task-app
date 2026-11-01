import { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskItem from "./components/TaskItem.jsx";
import * as api from "./api/tasks.js";

const FILTERS = ["all", "active", "completed"];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getTasks()
      .then(setTasks)
      .catch((err) => setError(api.errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const run = async (fn) => {
    try {
      setError("");
      await fn();
      return true;
    } catch (err) {
      setError(api.errorMessage(err));
      return false;
    }
  };

  const addTask = (data) =>
    run(async () => {
      const created = await api.createTask(data);
      setTasks((prev) => [created, ...prev]);
    });

  const updateTask = (id, updates) =>
    run(async () => {
      const updated = await api.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    });

  const toggleTask = (task) => updateTask(task._id, { completed: !task.completed });

  const deleteTask = (id) =>
    run(async () => {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    });

  const visible = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.completed);
    if (filter === "completed") return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
        <p className="subtitle">
          {tasks.length} tasks · {doneCount} completed · {tasks.length - doneCount} remaining
        </p>
      </header>

      <TaskForm onAdd={addTask} />

      {error && (
        <div className="error" role="alert">
          {error}
          <button onClick={() => setError("")} aria-label="Dismiss">×</button>
        </div>
      )}

      <div className="filters" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            className={`filter ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="empty">Loading tasks…</p>
      ) : visible.length === 0 ? (
        <p className="empty">
          {tasks.length === 0 ? "No tasks yet — add your first one above." : "Nothing here."}
        </p>
      ) : (
        <ul className="task-list">
          {visible.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={toggleTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
