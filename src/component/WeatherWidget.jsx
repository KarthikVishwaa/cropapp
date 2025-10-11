import React, { useEffect, useState } from "react";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [useManual, setUseManual] = useState(false);

  const API_KEY = "67bde50eef39474d978184329252504";

  const fetchWeather = async (location) => {
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
  };

  const fetchByGeo = () => {
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
  };

  useEffect(() => {
    if (!useManual) fetchByGeo();
  }, [useManual]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualLocation) return;
    fetchWeather(manualLocation);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-lg text-center transition-transform transform hover:scale-105">
      
      {/* Header with Back & Refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 py-10 gap-2">
        <h2 className="text-xl font-semibold">
          {weather
            ? `Weather in ${weather.location.name}, ${weather.location.region}`
            : "Weather Widget"}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => {
              setWeather(null);
              setError(null);
              setManualLocation("");
            }}
            className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition w-full sm:w-auto"
          >
            Back
          </button>
          <button
            onClick={() => (useManual ? setUseManual(false) : fetchByGeo())}
            className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 transition w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Manual location input */}
      <div className="mb-4">
        <label className="flex items-center justify-center space-x-2 cursor-pointer text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={useManual}
            onChange={() => setUseManual(!useManual)}
            className="form-checkbox"
          />
          <span>Enter location manually</span>
        </label>
      </div>

      {useManual && (
        <form onSubmit={handleManualSubmit} className="mb-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="City or lat,lon"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Go
          </button>
        </form>
      )}

      {/* Loading & Error */}
      {loading && <p className="text-gray-700">Loading weather...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Weather details */}
      {weather && (
        <div className="text-center">
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            className="mx-auto w-20 h-20"
          />
          <p className="text-3xl font-bold mt-2">{Math.round(weather.current.temp_c)}°C</p>
          <p className="capitalize text-gray-700">{weather.current.condition.text}</p>

          <div className="text-sm text-gray-600 mt-2 text-left space-y-1">
            <p>Feels Like: {Math.round(weather.current.feelslike_c)}°C</p>
            <p>Humidity: {weather.current.humidity}%</p>
            <p>Wind: {weather.current.wind_kph} km/h ({weather.current.wind_dir})</p>
            <p>Pressure: {weather.current.pressure_mb} mb</p>
            <p>Cloud Cover: {weather.current.cloud}%</p>
            <p>UV Index: {weather.current.uv}</p>
            <p>Visibility: {weather.current.vis_km} km</p>
            <p className="mt-1 text-xs text-gray-500">
              Last Updated: {weather.current.last_updated}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
