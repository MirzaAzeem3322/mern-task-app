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

## API Integration — OpenWeather

**API used:** [OpenWeather Current Weather API](https://openweathermap.org/current) (`/data/2.5/weather`)

**Implementation:**
- **Backend (Express):** new route `GET /api/weather?city=<name>` (`routes/weatherRoutes.js`, `controllers/weatherController.js`). It calls OpenWeather with the API key stored in `backend/.env` (`OPENWEATHER_API_KEY`), so the key is never exposed to the browser. The response is trimmed to the fields the UI needs (temperature, feels-like, humidity, wind, description, icon) and errors are mapped to clear messages (missing city, city not found, invalid key).
- **Frontend (React):** `WeatherWidget.jsx` sits above the task list. It loads Karachi's weather on start, lets the user search any city, and shows loading and error states. It calls our backend through `src/api/weather.js` (Axios).

**Setup:** get a free key at https://home.openweathermap.org/api_keys, add `OPENWEATHER_API_KEY=<your key>` to `backend/.env`, and restart the backend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather?city=Karachi` | Current weather for a city (via OpenWeather) |
