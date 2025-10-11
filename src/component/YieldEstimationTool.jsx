import React, { useState } from "react";

const OPENROUTER_API_KEY = "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"; // Replace with your key

export default function YieldEstimationTool() {
  const [area, setArea] = useState("");
  const [cropType, setCropType] = useState("");
  const [estimatedYield, setEstimatedYield] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate inputs
  const isValidCrop = /^[A-Za-z\s]+$/.test(cropType);
  const isValidArea = /^[0-9]+(\.[0-9]+)?$/.test(area);

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
              content: `Estimate the yield (in tons) for ${cropType} planted on ${area} acres of farmland. 
                        Provide a clear numeric estimate and explain any assumptions briefly.`,
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Crop type (letters only, e.g., Wheat)"
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        />
        <input
          type="text"
          placeholder="Farm area (numbers only, in acres)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border border-green-400 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600"
        />
      </div>

      <button
        onClick={handleEstimateYield}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        {loading ? "Estimating..." : "Estimate Yield"}
      </button>

      {estimatedYield && !loading && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg text-green-800 whitespace-pre-line">
          <p>{estimatedYield}</p>
        </div>
      )}
    </div>
  );
}
