import React, { useState } from "react";
import cropData from "../data/cropData.json";

export default function CropRecommendation() {
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleRecommend = () => {
    const validRainfall = parseInt(rainfall);
    if (!soil || !season || isNaN(validRainfall)) {
      alert("Please select soil, season, and enter rainfall.");
      return;
    }

    const results = cropData.filter(
      (c) =>
        c.soil.includes(soil) &&
        (c.season.includes(season) || c.season.includes("All seasons")) &&
        validRainfall >= c.minRainfall &&
        validRainfall <= c.maxRainfall
    );

    setRecommendations(results);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Crop Recommendation
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block mb-1 font-medium text-green-700">Soil Type</label>
          <select
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
            className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Soil</option>
            <option value="Clay">Clay</option>
            <option value="Loam">Loam</option>
            <option value="Sandy Loam">Sandy Loam</option>
            <option value="Black Soil">Black Soil</option>
            <option value="Red Soil">Red Soil</option>
            <option value="Shallow Soil">Shallow Soil</option>
            <option value="Alluvial">Alluvial</option>
            <option value="Red Loam">Red Loam</option>
            <option value="Laterite">Laterite</option>
            <option value="Clay Loam">Clay Loam</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-green-700">Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="">Select Season</option>
            <option value="Kuruvai">Kuruvai</option>
            <option value="Samba">Samba</option>
            <option value="Navarai">Navarai</option>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Summer">Summer</option>
            <option value="Annual">Annual</option>
            <option value="All seasons">All seasons</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-green-700">Rainfall (mm)</label>
          <input
            type="number"
            placeholder="e.g., 800"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            className="w-full border border-green-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <button
        onClick={handleRecommend}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition mb-6"
      >
        Recommend Crops
      </button>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((c, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-green-500 hover:scale-105 transform transition"
            >
              <h3 className="text-xl font-semibold text-green-800 mb-2">{c.crop}</h3>
              <p className="text-green-700 mb-1">
                <span className="font-semibold">Soil:</span> {c.soil.join(", ")}
              </p>
              <p className="text-green-700 mb-1">
                <span className="font-semibold">Season:</span> {c.season.join(", ")}
              </p>
              <p className="text-green-700">
                <span className="font-semibold">Rainfall:</span> {c.minRainfall} - {c.maxRainfall} mm
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-green-700 text-center">
          {soil || season || rainfall
            ? "No crops match your criteria."
            : "Enter your details to get recommendations."}
        </p>
      )}
    </div>
  );
}
