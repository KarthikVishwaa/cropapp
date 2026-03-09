import { useState } from "react";
import {
  Leaf,
  Sprout,
  AlertTriangle
} from "lucide-react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

export default function CropRecommendation() {
  const [soil, setSoil] = useState("");
  const [season, setSeason] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRecommend() {
    const rain = Number(rainfall);
    if (!soil || !season || isNaN(rain)) {
      alert("Please fill all fields correctly.");
      return;
    }

    setLoading(true);
    setResult(null);

    const prompt = `
You are an agricultural expert.

STRICT RULES:
- Respond ONLY in valid JSON
- No explanation text
- No markdown
- Simple words for farmers

Soil type: ${soil}
Season: ${season}
Expected rainfall: ${rain} mm

Return JSON exactly like this:
{
  "recommended_crops": [
    {
      "crop": "",
      "reason": ""
    }
  ],
  "note": ""
}
`;

    try {
      const res = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
          })
        }
      );

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      const parsed = safeParseJSON(content);

      if (!parsed) {
        setResult({ error: true });
      } else {
        setResult(parsed);
      }
    } catch {
      setResult({ error: true });
    }

    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <h2 className="text-3xl font-bold text-green-800 mb-2 flex items-center gap-2">
        <Leaf className="w-7 h-7" />
        Crop Recommendation
      </h2>
      <p className="text-gray-600 mb-6">
        AI-based crop suggestions based on soil, season, and rainfall
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <InputSelect
          label="Soil Type"
          value={soil}
          onChange={setSoil}
          options={[
            "Clay",
            "Loam",
            "Sandy Loam",
            "Black Soil",
            "Red Soil",
            "Alluvial",
            "Laterite",
            "Clay Loam"
          ]}
        />

        <InputSelect
          label="Season"
          value={season}
          onChange={setSeason}
          options={[
            "Kharif",
            "Rabi",
            "Summer",
            "Annual",
            "All seasons"
          ]}
        />

        <div>
          <label className="block mb-1 font-medium text-green-700">
            Rainfall (mm)
          </label>
          <input
            type="number"
            value={rainfall}
            onChange={(e) => setRainfall(e.target.value)}
            className="w-full border border-green-300 rounded-md p-2"
            placeholder="e.g. 800"
          />
        </div>
      </div>

      <button
        onClick={handleRecommend}
        disabled={loading}
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition"
      >
        {loading ? "Analyzing conditions..." : "Recommend Crops"}
      </button>

      {/* Results */}
      {result && !result.error && (
        <div className="mt-8 space-y-4">
          {result.recommended_crops.map((c, i) => (
            <div
              key={i}
              className="bg-green-50 border-l-4 border-green-600 p-4 rounded-xl"
            >
              <p className="text-lg font-semibold flex items-center gap-2">
                <Sprout className="w-5 h-5 text-green-700" />
                {c.crop}
              </p>
              <p className="text-gray-700 text-sm mt-1">
                {c.reason}
              </p>
            </div>
          ))}

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-yellow-600" />
            <p className="text-sm text-gray-700">
              {result.note}
            </p>
          </div>
        </div>
      )}

      {result?.error && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <p className="font-semibold">Unable to generate recommendations</p>
          <p className="text-sm">
            Please try again with correct inputs.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function InputSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-green-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-green-300 rounded-md p-2"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function safeParseJSON(text) {
  try {
    if (!text) return null;
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}
