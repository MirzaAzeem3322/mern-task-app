# MERN Task Manager

A simple full-stack task manager built with **MongoDB, Express, React and Node.js**.

## Features
- Responsive task list (desktop + mobile, light/dark mode)
- Add, edit, delete tasks
- Mark tasks as completed (checkbox)
- Filter: All / Active / Completed
- REST API with validation and error handling

## Project structure
```
mern-task-app/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/Task.js            # Mongoose schema
│   ├── controllers/taskController.js
│   ├── routes/taskRoutes.js
│   └── server.js                 # Express app entry
└── frontend/
    ├── src/
    │   ├── api/tasks.js          # Axios API calls
    │   ├── components/TaskForm.jsx
    │   ├── components/TaskItem.jsx
    │   ├── App.jsx
    │   └── index.css
    └── vite.config.js            # dev proxy /api -> :5000
```

## Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a free MongoDB Atlas cluster

## Setup & Run

### 1. Backend
```bash
cd backend
cp .env.example .env      # Windows: copy .env.example .env
# edit MONGO_URI in .env if using Atlas
npm install
npm run dev               # http://localhost:5000
```

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## REST API

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint          | Description        | Body                                        |
|--------|-------------------|--------------------|---------------------------------------------|
| GET    | `/api/tasks`      | Get all tasks      | –                                           |
| POST   | `/api/tasks`      | Create a task      | `{ "title": "...", "description": "..." }`  |
| PUT    | `/api/tasks/:id`  | Update a task      | any of `title`, `description`, `completed`  |
| DELETE | `/api/tasks/:id`  | Delete a task      | –                                           |

### Example (curl)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","description":"2 litres"}'

curl http://localhost:5000/api/tasks

curl -X PUT http://localhost:5000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

curl -X DELETE http://localhost:5000/api/tasks/<id>
```

### Task model
```json
{
  "_id": "6721...",
  "title": "Buy milk",
  "description": "2 litres",
  "completed": false,
  "createdAt": "2026-11-01T13:00:00.000Z",
  "updatedAt": "2026-11-01T13:00:00.000Z"
}
```
