import { useEffect, useState } from "react";
import { getWeather } from "../api/weather.js";
import { errorMessage } from "../api/tasks.js";

export default function WeatherWidget({ defaultCity = "Karachi" }) {
  const [city, setCity] = useState(defaultCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (name) => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      setWeather(await getWeather(name.trim()));
    } catch (err) {
      setError(errorMessage(err));
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(defaultCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather(city);
  };

  return (
    <section className="weather" aria-label="Current weather">
      <form className="weather-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          aria-label="City"
        />
        <button type="submit" className="btn btn-ghost" disabled={loading || !city.trim()}>
          {loading ? "Loading…" : "Get weather"}
        </button>
      </form>

      {error && <p className="weather-error">{error}</p>}

      {weather && !error && (
        <div className="weather-body">
          {weather.icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt={weather.description}
              width="64"
              height="64"
            />
          )}
          <div>
            <p className="weather-temp">
              {weather.temperature}°C
              <span className="weather-place">
                {weather.city}
                {weather.country ? `, ${weather.country}` : ""}
              </span>
            </p>
            <p className="weather-desc">{weather.description}</p>
            <p className="weather-meta">
              Feels like {weather.feelsLike}°C · Humidity {weather.humidity}% · Wind{" "}
              {weather.windSpeed} m/s
            </p>
          </div>
        </div>
      )}
      <p className="weather-credit">Weather data: OpenWeather</p>
    </section>
  );
}
