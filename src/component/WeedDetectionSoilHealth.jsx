import React, { useState } from "react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;

export default function CropWeedSoilText() {
  const [cropType, setCropType] = useState("");
  const [soilType, setSoilType] = useState("");
  const [language, setLanguage] = useState("English");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const cropOptions = [
    "Wheat", "Rice", "Corn", "Soybean",
    "Potato", "Tomato", "Cotton", "Sugarcane",
  ];

  const soilOptions = ["Sandy", "Loamy", "Clay", "Peaty", "Silty", "Chalky"];

  const languageOptions = ["English", "Tamil", "Hindi"];

  const handleAnalyze = async () => {
    if (!cropType) return alert("Please select a crop type.");
    if (!soilType) return alert("Please select soil type.");

    setLoading(true);
    setAiAnalysis("");

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
              
Provide detailed advice for growing ${cropType} on ${soilType} soil.
Include suggestions for:
- Weed control
- Pest management
- Soil health improvement

Keep it simple and actionable for farmers.
Respond completely in ${language} only.`,
            },
          ],
        }),
      });

      const data = await res.json();
      const analysisText = data?.choices?.[0]?.message?.content || "No analysis available.";
      setAiAnalysis(analysisText);
    } catch (err) {
      console.error(err);
      setAiAnalysis("Failed to get analysis: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-11 bg-white rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
        Crop & Soil AI Advisory
      </h2>

      {/* Crop Dropdown */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Select Crop:</label>
        <select
          className="border border-gray-300 rounded-lg p-2 w-full"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
        >
          <option value="">-- Select Crop --</option>
          {cropOptions.map((crop) => (
            <option key={crop} value={crop}>{crop}</option>
          ))}
        </select>
      </div>

      {/* Soil Dropdown */}
      <div>
        <label className="block mb-2 font-medium text-gray-700">Select Soil Type:</label>
        <select
          className="border border-gray-300 rounded-lg p-2 w-full"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
        >
          <option value="">-- Select Soil --</option>
          {soilOptions.map((soil) => (
            <option key={soil} value={soil}>{soil}</option>
          ))}
        </select>
      </div>

      {/* Language Selector */}
      <div>
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

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
      >
        {loading ? "Analyzing..." : "Get AI Advice"}
      </button>

      {/* Loading Animation */}
      {loading && (
        <div className="mt-4 flex flex-col gap-2 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-green-200 rounded w-full"></div>
          ))}
        </div>
      )}

      {/* AI Analysis */}
      {aiAnalysis && !loading && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-green-700 whitespace-pre-line">
          <p className="text-xs text-gray-400 mb-2">Response in {language}</p>
          {aiAnalysis}
        </div>
      )}
    </div>
  );
}