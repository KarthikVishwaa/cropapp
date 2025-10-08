import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">About CropSense</h2>
      
      <p className="text-green-700 mb-4 text-justify">
        CropSense is an intelligent agriculture support platform designed to assist farmers
        in making informed decisions. From crop recommendations based on soil, season, and rainfall
        to disease detection, market prices, and farm reminders, CropSense provides all the essential
        tools in one place.
      </p>

      <p className="text-green-700 mb-4 text-justify">
        Our mission is to empower farmers with real-time information, helping them maximize yield,
        minimize losses, and adopt sustainable farming practices. With user-friendly tools and
        modern technology, CropSense bridges the gap between traditional farming knowledge and
        modern agricultural insights.
      </p>

      <p className="text-green-700 text-justify">
        Whether you are a smallholder or a large-scale farmer, CropSense provides actionable
        recommendations to make farming smarter, efficient, and more productive.
      </p>
    </div>
  );
}
