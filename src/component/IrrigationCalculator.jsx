import { useState } from "react";
import OpenAI from "openai";
import FarmLoader from "../component/FarmLoader";

const crops = {
  Paddy: 1.4,
  Maize: 1.0,
  Sugarcane: 1.6,
  Cotton: 1.1,
  Tomato: 0.9,
  Groundnut: 0.85,
};

const soils = {
  Sandy: 1.3,
  Loamy: 1.0,
  Clay: 0.8,
};

const methods = {
  Flood: 1.4,
  Sprinkler: 1.0,
  Drip: 0.6,
};

const weatherFactors = {
  Normal: 1.0,
  Hot: 1.2,
  Cool: 0.85,
};

export default function IrrigationCalculator() {
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [soil, setSoil] = useState("");
  const [method, setMethod] = useState("");
  const [weather, setWeather] = useState("");

  const [waterResult, setWaterResult] = useState(null);
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true, // ⚠ Prototype only
  });

  const calculateWater = async () => {
    if (!crop || !area || !soil || !method || !weather) {
      return alert("Please fill all fields");
    }

    const baseWater = 5000; // liters per acre baseline
    const acres = parseFloat(area);

    if (isNaN(acres) || acres <= 0) {
      return alert("Enter valid land area");
    }

    const water =
      baseWater *
      acres *
      crops[crop] *
      soils[soil] *
      methods[method] *
      weatherFactors[weather];

    const roundedWater = Math.round(water);

    setWaterResult(roundedWater);
    setLoading(true);
    setAiAdvice("");

    try {
      const prompt = `
Crop: ${crop}
Area: ${acres} acres
Soil: ${soil}
Method: ${method}
Weather: ${weather}
Estimated Water: ${roundedWater} liters

Task:
Provide irrigation advice for farmers.

Rules:
- Mention crop & conditions explicitly
- Do NOT change calculated water
- Provide practical guidance
- Output in Tamil, English, Hindi
`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      });

      setAiAdvice(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      alert("AI advice failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-green-100 p-6 mt-24">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Irrigation Calculator
      </h2>

      <select
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3"
      >
        <option value="">Select Crop</option>
        {Object.keys(crops).map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Farm Area (Acres)"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3"
      />

      <select
        value={soil}
        onChange={(e) => setSoil(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3"
      >
        <option value="">Soil Type</option>
        {Object.keys(soils).map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3"
      >
        <option value="">Irrigation Method</option>
        {Object.keys(methods).map((m) => (
          <option key={m}>{m}</option>
        ))}
      </select>

      <select
        value={weather}
        onChange={(e) => setWeather(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3"
      >
        <option value="">Weather Condition</option>
        {Object.keys(weatherFactors).map((w) => (
          <option key={w}>{w}</option>
        ))}
      </select>

      <button
        onClick={calculateWater}
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full"
      >
        Calculate Water Requirement
      </button>

      {waterResult && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-800">
          Estimated Water Needed: <strong>{waterResult} liters</strong>
        </div>
      )}

      {loading && <FarmLoader />}

      {aiAdvice && !loading && (
        <div className="mt-3 bg-white border border-green-200 rounded-lg p-3 text-green-900 whitespace-pre-wrap text-sm leading-relaxed">
          {aiAdvice}
        </div>
      )}
    </div>
  );
}
