import React from "react";
import { CloudSun, Sprout, Leaf, MessageCircle, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            alt="Farm background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-green-800 mb-6">
          Empowering Farmers with AI & Data
        </h1>
        <p className="text-lg md:text-xl text-green-900 max-w-2xl mb-8">
          CropSense.com helps farmers in Tamil Nadu make smarter decisions using
          real-time weather, AI crop recommendations, and market insights — all
          for free.
        </p>
        <a
          href="#features"
          className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition"
        >
          Explore Features
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-green-800 mb-12">
          Smart Farming Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <CloudSun className="w-10 h-10 text-green-600" />,
              title: "Live Weather Updates",
              desc: "Get accurate, real-time forecasts to plan irrigation and harvesting efficiently using Open-Meteo API.",
            },
            {
              icon: <Sprout className="w-10 h-10 text-green-600" />,
              title: "Crop Recommendation",
              desc: "AI-based suggestions for the best crops based on soil, season, and climate — all from open data.",
            },
            {
              icon: <Leaf className="w-10 h-10 text-green-600" />,
              title: "Disease Detection",
              desc: "Upload crop images to instantly detect diseases using TensorFlow.js & open-source models.",
            },
            {
              icon: <MapPin className="w-10 h-10 text-green-600" />,
              title: "Nearby Market Prices",
              desc: "Find the nearest mandis and compare live crop prices with data from Agmarknet.",
            },
            {
              icon: <MessageCircle className="w-10 h-10 text-green-600" />,
              title: "Community & Expert Chat",
              desc: "Connect with other farmers and agri experts instantly using free Firebase-based forums.",
            },
            {
              icon: <Sprout className="w-10 h-10 text-green-600" />,
              title: "Fertilizer & Irrigation Tools",
              desc: "Plan nutrient and water usage efficiently with built-in calculators for optimal yield.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-green-50 rounded-2xl p-6 text-center shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                {f.title}
              </h3>
              <p className="text-green-700 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-lime-600 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Grow Smarter?
        </h2>
        <p className="mb-8 text-lg">
          Join the CropSense community and start using smart tools today.
        </p>
        <a
          href="/signup"
          className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-100 transition"
        >
          Get Started
        </a>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-green-900 text-center text-green-100 text-sm">
        © {new Date().getFullYear()} CropSense.com — Built for Farmers, by Farmers.
      </footer>
    </div>
  );
}
