import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ""}/api/weather`,
});

// Calls our Express backend, which calls OpenWeather
export const getWeather = (city) => api.get("/", { params: { city } }).then((r) => r.data);
