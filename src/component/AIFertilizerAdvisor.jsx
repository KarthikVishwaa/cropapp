import { useState } from "react";
import {
  Leaf,
  Ruler,
  AlertTriangle,
  Calculator
} from "lucide-react";

import { OPENROUTER_API_KEY, OPENROUTER_MODEL } from "../config/openrouter";

export default function AIFertilizerAdvisor() {
  const [crop, setCrop] = useState("");
  const [area, setArea] = useState(1);
  const [day, setDay] = useState(20);
  const [issue, setIssue] = useState("No visible problem");
  const [customIssue, setCustomIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function getFertilizerAdvice() {
    setLoading(true);
    setResult(null);

    const finalIssue =
      issue === "OTHER" ? customIssue || "User described issue" : issue;

    const prompt = `
You are an agricultural fertilizer expert.

STRICT RULES:
- Respond ONLY in valid JSON
- Use very simple words (elder-friendly)
- Give exact quantities
- Do NOT give general theory
- Units must be in kilograms

Crop: ${crop}
Land size: ${area} acre
Crop age: ${day} days
Observed issue: ${finalIssue}

Return JSON exactly in this format:
{
  "recommended_fertilizer": [
    {
      "name": "",
      "quantity_kg": "",
      "when_to_apply": ""
    }
  ],
  "important_note": ""
}
`;

    try {
      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2
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
    <div className="p-4 max-w-xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
        <Leaf className="w-7 h-7" />
        AI Fertilizer Advisor
      </h1>
      <p className="text-gray-600 mb-5">
        Exact fertilizer quantity for your field
      </p>

      {/* Crop */}
      <Section title="Crop">
        <input
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          placeholder="Rice, Wheat, Maize..."
          className="w-full p-4 border rounded-2xl text-lg"
        />
      </Section>

      {/* Land size */}
      <Section title="Land size (acre)">
        <div className="flex items-center gap-3">
          <Ruler className="text-green-600" />
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full p-4 border rounded-2xl text-lg"
          />
        </div>
      </Section>

      {/* Crop age */}
      <Section title="Crop age (days)">
        <p className="text-center font-semibold mb-1">{day} days</p>
        <input
          type="range"
          min="1"
          max="150"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="w-full"
        />
      </Section>

      {/* Issue */}
      <Section title="Any problem seen?">
        <select
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          className="w-full p-4 border rounded-2xl"
        >
          <option>No visible problem</option>
          <option>Yellow leaves</option>
          <option>Slow growth</option>
          <option>Pest seen</option>
          <option>Leaf spots / disease</option>
          <option value="OTHER">Other (type manually)</option>
        </select>

        {issue === "OTHER" && (
          <input
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
            placeholder="Describe the problem (e.g. leaf curling, poor flowering)"
            className="w-full mt-3 p-4 border rounded-2xl text-lg"
          />
        )}
      </Section>

      {/* Action */}
      <button
        onClick={getFertilizerAdvice}
        disabled={
          !crop ||
          loading ||
          (issue === "OTHER" && !customIssue.trim())
        }
        className="w-full mt-5 bg-green-700 text-white
        py-4 rounded-2xl text-lg font-bold disabled:opacity-50
        flex items-center justify-center gap-2"
      >
        <Calculator className="w-5 h-5" />
        {loading ? "Calculating..." : "Get Fertilizer Advice"}
      </button>

      {/* Result */}
      {result && !result.error && (
        <div className="mt-6 space-y-4">
          {result.recommended_fertilizer.map((f, i) => (
            <div
              key={i}
              className="bg-white border-l-4 border-green-600
              p-4 rounded-xl shadow-sm"
            >
              <p className="font-semibold text-lg">{f.name}</p>
              <p className="text-gray-700">
                Quantity: <strong>{f.quantity_kg} kg</strong>
              </p>
              <p className="text-gray-600 text-sm">
                When: {f.when_to_apply}
              </p>
            </div>
          ))}

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl flex gap-3">
            <AlertTriangle className="text-yellow-600" />
            <p className="text-sm text-gray-700">
              {result.important_note}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {result?.error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <p className="font-semibold">Unable to calculate</p>
          <p className="text-sm">
            Please check details and try again.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        This guidance is supportive. Always adapt to local soil and weather.
      </p>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function Section({ title, children }) {
  return (
    <div className="mb-4">
      <h2 className="font-semibold mb-2 text-gray-800">
        {title}
      </h2>
      {children}
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
