import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api/tasks`,
  headers: { "Content-Type": "application/json" },
});

export const getTasks = () => api.get("/").then((r) => r.data);
export const createTask = (task) => api.post("/", task).then((r) => r.data);
export const updateTask = (id, updates) => api.put(`/${id}`, updates).then((r) => r.data);
export const deleteTask = (id) => api.delete(`/${id}`).then((r) => r.data);

export const errorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";
