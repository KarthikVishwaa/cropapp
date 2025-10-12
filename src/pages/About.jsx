import React from "react";

const tools = [
  "Digital Crop Diary",
  "Government Schemes",
  "Weather Integration",
  "Crop Recommendation",
  "Plant Disease Identification",
  "Weed Detection & Soil Health",
  "Yield Estimation Tool",
  "Farm Location Mapping",
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* About Section */}
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-green-100">
        <h2 className="text-4xl font-extrabold text-green-800 mb-8 text-center">
          About CropSense
        </h2>

        <p className="text-green-700 mb-6 text-justify text-lg leading-relaxed">
          CropSense is an intelligent agriculture support platform designed to assist farmers
          in making informed decisions. From crop recommendations based on soil, season, and rainfall
          to disease detection, market prices, and farm reminders, CropSense provides all the essential
          tools in one place.
        </p>

        <p className="text-green-700 mb-6 text-justify text-lg leading-relaxed">
          Our mission is to empower farmers with real-time information, helping them maximize yield,
          minimize losses, and adopt sustainable farming practices. With user-friendly tools and
          modern technology, CropSense bridges the gap between traditional farming knowledge and
          modern agricultural insights.
        </p>

        <p className="text-green-700 text-justify text-lg leading-relaxed">
          Whether you are a smallholder or a large-scale farmer, CropSense provides actionable
          recommendations to make farming smarter, efficient, and more productive.
        </p>
      </div>

      {/* Tools Section */}
      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Our Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center text-center text-green-800 font-semibold text-lg cursor-pointer hover:scale-105 transform"
            >
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
