import { useState } from "react";
import {
  Leaf,
  Sprout,
  Droplets,
  CalendarDays,
  AlertTriangle,
  Tractor
} from "lucide-react";

import { OPENROUTER_API_KEY, OPENROUTER_MODEL } from "../config/openrouter";

const commonIssues = [
  "No visible problem",
  "Yellow leaves",
  "Slow growth",
  "Pest seen",
  "Leaf spots / disease"
];

export default function AdvancedCropAdvisory() {
  const [crop, setCrop] = useState("");
  const [day, setDay] = useState(10);
  const [issue, setIssue] = useState("No visible problem");
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);

  async function getAdvisory() {
    setLoading(true);
    setAdvisory(null);

    const prompt = `
You are a professional agricultural advisor.

STRICT RULES:
- Respond ONLY with valid JSON
- No markdown
- No explanation
- No extra text
- Use very simple words suitable for elderly farmers

Crop: ${crop}
Crop age: ${day} days
Observed issue: ${issue}

Return JSON exactly in this format:
{
  "stage": "",
  "what_to_do_today": "",
  "watering": "",
  "fertilizer": "",
  "warning": ""
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
        setAdvisory({ error: true });
      } else {
        setAdvisory(parsed);
      }
    } catch {
      setAdvisory({ error: true });
    }

    setLoading(false);
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-green-700 mb-2 flex items-center gap-2">
        <Leaf className="w-7 h-7" />
        Smart Crop Guide
      </h1>
      <p className="text-gray-600 mb-5">
        Simple daily advice for healthy crops
      </p>

      {/* Step 1 */}
      <Section title="1. Select Crop">
        <input
          placeholder="Enter crop name (Rice, Wheat...)"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full p-4 border rounded-2xl text-lg"
        />
      </Section>

      {/* Step 2 */}
      <Section title="2. Crop Age">
        <p className="text-center text-lg font-semibold mb-1">
          {day} days old
        </p>
        <input
          type="range"
          min="1"
          max="150"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-center text-sm text-gray-500 mt-1">
          Adjust slider to match crop age
        </p>
      </Section>

      {/* Step 3 */}
      <Section title="3. What do you observe?">
        <div className="grid grid-cols-2 gap-3">
          {commonIssues.map((i) => (
            <button
              key={i}
              onClick={() => setIssue(i)}
              className={`p-3 rounded-xl border text-sm font-medium
                ${
                  issue === i
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
            >
              {i}
            </button>
          ))}
        </div>
      </Section>

      {/* Action button */}
      <button
        onClick={getAdvisory}
        disabled={!crop || loading}
        className="w-full mt-5 bg-green-700 text-white
        py-4 rounded-2xl text-lg font-bold disabled:opacity-50"
      >
        {loading ? "Analyzing crop..." : "Get Today’s Advice"}
      </button>

      {/* Result */}
      {advisory && !advisory.error && (
        <div className="mt-6 space-y-4">
          <AdviceCard
            icon={Sprout}
            title="Crop Stage"
            value={advisory.stage}
          />
          <AdviceCard
            icon={Tractor}
            title="What to do today"
            value={advisory.what_to_do_today}
          />
          <AdviceCard
            icon={Droplets}
            title="Watering"
            value={advisory.watering}
          />
          <AdviceCard
            icon={CalendarDays}
            title="Fertilizer"
            value={advisory.fertilizer}
          />
          <AdviceCard
            icon={AlertTriangle}
            title="Warning"
            value={advisory.warning}
          />
        </div>
      )}

      {/* Error fallback */}
      {advisory?.error && (
        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl">
          <p className="font-semibold">Advice not clear</p>
          <p className="text-sm text-gray-700">
            Please check crop details and try again.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6 text-center">
        This guidance is supportive. Always adapt to local soil and weather.
      </p>
    </div>
  );
}

/* ---------------- Helper Components ---------------- */

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold mb-2 text-gray-800">
        {title}
      </h2>
      {children}
    </div>
  );
}

function AdviceCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-white border-l-4 border-green-600
      p-4 rounded-xl shadow-sm flex gap-3">
      <Icon className="w-6 h-6 text-green-600 mt-1" />
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-gray-700 text-base">{value}</p>
      </div>
    </div>
  );
}

/* ---------------- Safe JSON Parser ---------------- */

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
