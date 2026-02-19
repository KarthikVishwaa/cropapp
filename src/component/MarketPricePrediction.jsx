import { useState } from "react";
import OpenAI from "openai";
import FarmLoader from "../component/FarmLoader";

const districts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore",
  "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
  "Kallakurichi", "Kancheepuram", "Karur", "Krishnagiri",
  "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal",
  "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram",
  "Ranipet", "Salem", "Sivagangai", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli",
  "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur",
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram",
  "Virudhunagar"
];

export default function MarketPricePrediction() {
  const [district, setDistrict] = useState("");
  const [crop, setCrop] = useState("");
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const client = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true, // ⚠ Prototype only
  });

  const analyzePrices = async () => {
    if (!district) return alert("Please select a district");
    if (!crop) return alert("Please enter crop name");

    setLoading(true);
    setInsight("");

    try {
      const prompt = `
District: ${district}
Crop: ${crop}

Task:
Provide farmer-friendly market insights.

Rules:
- Do NOT invent exact prices
- Mention district & crop explicitly
- Output in Tamil, English, Hindi
- Focus on trends, risks, decisions
`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [{ role: "user", content: prompt }],
      });

      setInsight(response.choices[0].message.content);
    } catch (err) {
      console.error(err);
      alert("AI request failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-green-100 p-6 mt-24">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Market Price Prediction
      </h2>

      <select
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Enter Crop Name"
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        className="w-full border border-green-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      <button
        onClick={analyzePrices}
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition w-full"
      >
        Analyze Market Insight
      </button>

      {loading && <FarmLoader />}

      {insight && !loading && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 whitespace-pre-wrap text-sm leading-relaxed">
          {insight}
        </div>
      )}
    </div>
  );
}
