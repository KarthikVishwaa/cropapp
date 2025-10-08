import React, { useState, useEffect } from "react";
import marketData from "../data/marketData.json";

export default function MarketPrices() {
  const [data, setData] = useState([]);

  // Initialize data on mount
  useEffect(() => {
    setData(marketData);
  }, []);

  // Simulate live price fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          price: Math.max(
            1000,
            Math.round(item.price * (0.98 + Math.random() * 0.04)) // ±2% random fluctuation
          ),
        }))
      );
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        Live Crop Market Prices
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-green-500 hover:scale-105 transform transition-all duration-300"
          >
            <h3 className="text-xl font-semibold text-green-800 mb-2">{item.crop}</h3>
            <p className="text-green-700 mb-1">
              <span className="font-semibold">Market:</span> {item.market}
            </p>
            <p className="text-green-700 mb-1">
              <span className="font-semibold">Price:</span> {item.price} {item.unit}
            </p>
            <p className="text-green-700">
              <span className="font-semibold">Date:</span> {item.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
