import mongoose from "mongoose";
import Task from "../models/Task.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/tasks  -> get all tasks (newest first)
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks  -> create a task
export const createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id  -> update a task (title, description, completed)
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updates = {};
    const { title, description, completed } = req.body;
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: "Title cannot be empty" });
      updates.title = title;
    }
    if (description !== undefined) updates.description = description;
    if (completed !== undefined) updates.completed = Boolean(completed);

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id  -> delete a task
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted", id });
  } catch (err) {
    next(err);
  }
};
