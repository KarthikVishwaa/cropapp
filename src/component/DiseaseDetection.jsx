import React, { useState, useRef } from "react";

const PLANT_ID_API_KEY = "KbwTOFU81lo6TEnJqjHcKNCYv3ESNbt29NzSxecOyOyzTRazFp";
const OPENROUTER_API_KEY = "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"; // Replace with your OpenRouter key

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [disease, setDisease] = useState(null);
  const [remedies, setRemedies] = useState(null);
  const [loadingDetection, setLoadingDetection] = useState(false);
  const [loadingRemedies, setLoadingRemedies] = useState(false);
  const fileInputRef = useRef();

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      setDisease(null);
      setRemedies(null);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setDisease(null);
      setRemedies(null);
    }
  };

  const handleDetectDisease = async () => {
    if (!image) {
      alert("Please upload a leaf image first.");
      return;
    }

    setLoadingDetection(true);
    setDisease(null);
    setRemedies(null);

    try {
      const formData = new FormData();
      formData.append("images", image);
      formData.append("organs", "leaf");
      formData.append("modifiers", JSON.stringify(["similar_images"]));

      const res = await fetch("https://api.plant.id/v2/identify", {
        method: "POST",
        headers: {
          "Api-Key": PLANT_ID_API_KEY,
        },
        body: formData,
      });

      const data = await res.json();
      const diseaseName =
        data.suggestions?.[0]?.plant_details?.disease?.name ||
        data.suggestions?.[0]?.plant_name ||
        "Unknown Disease";

      setDisease(diseaseName);
    } catch (err) {
      console.error(err);
      alert("Failed to detect disease. Try again.");
    } finally {
      setLoadingDetection(false);
    }

    // Fetch remedies separately
    if (disease || image) {
      setLoadingRemedies(true);
      try {
        const remedyRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
                content: `Provide actionable remedies for the following plant disease: ${
                  disease || "Unknown Disease"
                }. Make it simple and safe for farmers.`,
              },
            ],
          }),
        });

        const remedyData = await remedyRes.json();
        const remedyText = remedyData?.choices?.[0]?.message?.content || "No remedy found.";
        setRemedies(remedyText);
      } catch (err) {
        console.error(err);
        setRemedies("Failed to fetch remedies.");
      } finally {
        setLoadingRemedies(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Plant Disease Detection
      </h2>

      {/* Drag & Drop Area */}
      <div
        className="border-2 border-dashed border-green-400 rounded-lg p-6 mb-6 flex flex-col items-center justify-center cursor-pointer hover:border-green-600 transition"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current.click()}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Uploaded Leaf"
            className="w-48 h-48 object-cover rounded-lg shadow-md mb-2"
          />
        ) : (
          <p className="text-green-700 text-center">
            Drag & drop a leaf image here, or click to select
          </p>
        )}
        <button
          onClick={() => fileInputRef.current.click()}
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Choose Image
        </button>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>

      <button
        onClick={handleDetectDisease}
        className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition mb-6"
        disabled={loadingDetection || loadingRemedies}
      >
        {loadingDetection || loadingRemedies ? "Please wait..." : "Detect Disease"}
      </button>

      {/* Loading Spinner */}
      {(loadingDetection || loadingRemedies) && (
        <div className="flex justify-center items-center py-6">
          <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Disease Result */}
      {!loadingDetection && disease && (
        <div className="bg-green-50 p-4 rounded-2xl shadow-md mb-4">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Disease:</h3>
          <p className="text-green-700">{disease}</p>
        </div>
      )}

      {/* Remedies */}
      {!loadingRemedies && remedies && (
        <div className="bg-green-50 p-4 rounded-2xl shadow-md">
          <h3 className="text-xl font-semibold text-green-800 mb-2">Remedies:</h3>
          <p className="text-green-700 whitespace-pre-line">{remedies}</p>
        </div>
      )}
    </div>
  );
}
