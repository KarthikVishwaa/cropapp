import { useState, useRef } from "react";
import {
  Leaf,
  AlertTriangle,
  ShieldPlus,
  Beaker
} from "lucide-react";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_KEY;
const OPENAI_MODEL = "gpt-4o-mini";

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [disease, setDisease] = useState(null);
  const [remedyData, setRemedyData] = useState(null);
  const [loadingDetect, setLoadingDetect] = useState(false);
  const fileInputRef = useRef(null);

  /* ---------------- Image handlers ---------------- */

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setImage(e.dataTransfer.files[0]);
      resetResults();
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      resetResults();
    }
  };

  function resetResults() {
    setDisease(null);
    setRemedyData(null);
  }

  /* ---------------- Convert image to base64 ---------------- */

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /* ---------------- Main logic ---------------- */

  async function handleDetectDisease() {
    if (!image) {
      alert("Please upload a leaf image.");
      return;
    }

    setLoadingDetect(true);
    resetResults();

    try {
      const base64Image = await toBase64(image);

      const prompt = `
You are an expert agricultural plant pathologist.

STRICT RULES:
- Respond ONLY in valid JSON
- No explanations outside JSON
- Use simple words for farmers
- Give safe, common remedies only
- If no disease is visible, set disease to "Healthy Plant" and leave remedy fields as "Not needed"

Analyze this leaf image and return JSON exactly like this:
{
  "disease": "",
  "symptoms": "",
  "chemical_control": "",
  "organic_control": "",
  "prevention": ""
}
`;

      const res = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image_url",
                    image_url: {
                      url: `data:${image.type};base64,${base64Image}`
                    }
                  },
                  {
                    type: "text",
                    text: prompt
                  }
                ]
              }
            ],
            temperature: 0.2
          })
        }
      );

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      const parsed = safeParseJSON(content);

      if (!parsed) {
        setRemedyData({ error: true });
      } else {
        setDisease(parsed.disease);
        setRemedyData(parsed);
      }
    } catch {
      setRemedyData({ error: true });
    }

    setLoadingDetect(false);
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-800 mb-6 flex items-center gap-2 justify-center">
        <Leaf className="w-7 h-7" />
        Plant Disease Detection
      </h2>

      {/* Upload */}
      <div
        className="border-2 border-dashed border-green-400 rounded-xl p-6 mb-6 text-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Leaf"
            className="mx-auto w-48 h-48 object-cover rounded-lg shadow"
          />
        ) : (
          <p className="text-green-700">
            Drag & drop leaf image or click to upload
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <button
        onClick={handleDetectDisease}
        disabled={loadingDetect}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold"
      >
        {loadingDetect ? "Analyzing..." : "Detect Disease"}
      </button>

      {loadingDetect && (
        <div className="flex justify-center py-6">
          <div className="w-10 h-10 border-4 border-green-300 border-t-green-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Disease */}
      {disease && (
        <div className="mt-6 bg-green-50 p-4 rounded-xl">
          <h3 className="font-semibold text-lg mb-1">
            Detected Disease
          </h3>
          <p className="text-green-800">{disease}</p>
        </div>
      )}

      {/* Remedies */}
      {remedyData && !remedyData.error && (
        <div className="mt-6 space-y-4">
          <RemedyCard
            icon={AlertTriangle}
            title="Symptoms"
            text={remedyData.symptoms}
          />
          <RemedyCard
            icon={Beaker}
            title="Chemical Control"
            text={remedyData.chemical_control}
          />
          <RemedyCard
            icon={Leaf}
            title="Organic Control"
            text={remedyData.organic_control}
          />
          <RemedyCard
            icon={ShieldPlus}
            title="Prevention"
            text={remedyData.prevention}
          />
        </div>
      )}

      {remedyData?.error && (
        <div className="mt-6 bg-red-50 p-4 rounded-xl">
          Unable to fetch remedies. Try again.
        </div>
      )}
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function RemedyCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-white border-l-4 border-green-600 p-4 rounded-xl shadow-sm flex gap-3">
      <Icon className="w-6 h-6 text-green-600 mt-1" />
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-gray-700 text-sm">{text}</p>
      </div>
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
