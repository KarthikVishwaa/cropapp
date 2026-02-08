import { useEffect, useState, useCallback } from "react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [useManual, setUseManual] = useState(false);

  const API_KEY = "67bde50eef39474d978184329252504";

  const fetchWeather = useCallback(async (location) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch weather data.");
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  const fetchByGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => {
        setError("Permission denied for geolocation.");
        setLoading(false);
      }
    );
  }, [fetchWeather]);

  useEffect(() => {
    if (!useManual) {
      fetchByGeo();
    }
  }, [useManual, fetchByGeo]); // ✅ ESLint satisfied

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLocation) return;
    fetchWeather(manualLocation);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg text-center">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">
          {weather
            ? `Weather in ${weather.location.name}, ${weather.location.region}`
            : "Weather Widget"}
        </h2>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setWeather(null);
              setError(null);
              setManualLocation("");
            }}
            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
          >
            Back
          </button>

          <button
            onClick={() => (useManual ? setUseManual(false) : fetchByGeo())}
            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Manual toggle */}
      <div className="mb-4">
        <label className="flex items-center justify-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={useManual}
            onChange={() => setUseManual(!useManual)}
          />
          Enter location manually
        </label>
      </div>

      {useManual && (
        <form onSubmit={handleManualSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="City or lat,lon"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="flex-1 p-2 rounded-md border"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Go
          </button>
        </form>
      )}

      {/* Status */}
      {loading && <p>Loading weather...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Weather */}
      {weather && (
        <div>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="mx-auto w-20 h-20"
          />
          <p className="text-3xl font-bold">
            {Math.round(weather.current.temp_c)}°C
          </p>
          <p className="capitalize">{weather.current.condition.text}</p>

          <div className="text-sm text-gray-700 mt-2 space-y-1 text-left">
            <p>Feels Like: {Math.round(weather.current.feelslike_c)}°C</p>
            <p>Humidity: {weather.current.humidity}%</p>
            <p>Wind: {weather.current.wind_kph} km/h</p>
            <p>Pressure: {weather.current.pressure_mb} mb</p>
            <p>UV Index: {weather.current.uv}</p>
            <p className="text-xs text-gray-500">
              Last Updated: {weather.current.last_updated}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
