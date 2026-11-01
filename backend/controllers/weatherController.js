// Proxies requests to the OpenWeather "Current Weather" API.
// The API key stays on the server (backend/.env) and is never exposed to the browser.
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

// GET /api/weather?city=Karachi
export const getWeather = async (req, res, next) => {
  try {
    const city = (req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "OPENWEATHER_API_KEY is not set on the server" });
    }

    const url = `${OPENWEATHER_URL}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url); // built-in fetch (Node 18+)
    const data = await response.json();

    if (!response.ok) {
      const status = response.status === 404 ? 404 : response.status === 401 ? 502 : response.status;
      const message =
        response.status === 404
          ? `City "${city}" not found`
          : response.status === 401
          ? "Invalid or inactive OpenWeather API key"
          : data.message || "Weather service error";
      return res.status(status).json({ message });
    }

    // Send only the fields the frontend needs
    res.status(200).json({
      city: data.name,
      country: data.sys?.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind?.speed,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
    });
  } catch (err) {
    next(err);
  }
};
