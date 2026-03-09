import React, { useState } from "react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

export default function YieldEstimationTool() {
  const [area, setArea] = useState("");
  const [cropType, setCropType] = useState("");
  const [language, setLanguage] = useState("English");
  const [estimatedYield, setEstimatedYield] = useState(null);
  const [loading, setLoading] = useState(false);

  const isValidCrop = /^[A-Za-z\s]+$/.test(cropType);
  const isValidArea = /^[0-9]+(\.[0-9]+)?$/.test(area);

  const languageOptions = ["English", "Tamil", "Hindi"];

  const handleEstimateYield = async () => {
    if (!cropType || !area) {
      alert("Please fill all fields.");
      return;
    }
    if (!isValidCrop) {
      alert("Crop type must contain only letters.");
      return;
    }
    if (!isValidArea) {
      alert("Area must be a valid number.");
      return;
    }

    setLoading(true);
    setEstimatedYield(null);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `You are an agricultural expert. Respond ONLY in ${language} language.

Estimate the yield (in tons) for ${cropType} planted on ${area} acres of farmland.
Provide a clear numeric estimate and explain any assumptions briefly.
Respond completely in ${language} only.`,
            },
          ],
        }),
      });

      const data = await res.json();
      const yieldText = data?.choices?.[0]?.message?.content || "No yield estimation available.";
      setEstimatedYield(yieldText);
    } catch (err) {
      console.error(err);
      setEstimatedYield("Failed to estimate yield: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-6">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Yield Estimation Tool
      </h2>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Crop type (e.g., Wheat)"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Farm area in acres (e.g., 5)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        />
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">Select Language:</label>
        <div className="flex gap-3">
          {languageOptions.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-2 rounded-lg font-medium border transition ${
                language === lang
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-500"
              }`}
            >
              {lang === "English" ? "🇬🇧 English" : lang === "Tamil" ? "🇮🇳 Tamil" : "🇮🇳 Hindi"}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleEstimateYield}
        className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        {loading ? "Estimating..." : "Estimate Yield"}
      </button>

      {/* Loading Animation */}
      {loading && (
        <div className="mt-4 flex flex-col gap-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-green-200 rounded w-full"></div>
          ))}
        </div>
      )}

      {/* Result */}
      {estimatedYield && !loading && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 whitespace-pre-line">
          <p className="text-xs text-gray-400 mb-2">Response in {language}</p>
          <p>{estimatedYield}</p>
        </div>
      )}
    </div>
  );
}