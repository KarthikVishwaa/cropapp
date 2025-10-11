import React, { useState } from "react";

const OPENROUTER_API_KEY = "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";

export default function CropRecommendation() {
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecommend = async () => {
    const validRainfall = parseInt(rainfall);
    if (!soil || !season || isNaN(validRainfall)) {
      alert("Please select soil, season, and enter valid rainfall.");
      return;
    }

    setLoading(true);
    setRecommendations("");

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "user",
              content: `Suggest suitable crops for farming based on the following conditions:
              - Soil type: ${soil}
              - Season: ${season}
              - Expected rainfall: ${validRainfall} mm
              Provide 5-7 crop recommendations, and include a short reason for each. Keep it simple for farmers.`,
            },
          ],
        }),
      });

      const data = await res.json();
      const aiText = data?.choices?.[0]?.message?.content || "No recommendations available.";
      setRecommendations(aiText);
    } catch (err) {
      console.error(err);
      setRecommendations("Failed to fetch recommendations: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-lg py-12">
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
        {loading ? "Fetching Recommendations..." : "Recommend Crops"}
      </button>

      {/* Recommendations */}
      {recommendations && (
        <div className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-green-500 text-green-700 whitespace-pre-line">
          {recommendations}
        </div>
      )}

      {!recommendations && !loading && (
        <p className="text-green-700 text-center">
          Enter your details to get AI-based crop recommendations.
        </p>
      )}
    </div>
  );
}
