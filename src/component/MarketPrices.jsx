import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commodityMap = {
  rice: ["Paddy(Dhan)(Common)", "Sona Mahsuri", "IR 36", "Paddy(Dhan)(Hybrid)"],
  wheat: ["Wheat", "Lokwan", "PBW 343"],
  maize: ["Maize", "Hybrid/Local"],
};

export default function LiveMandiPrices() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const LIMIT = 50;
  const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

  const fetchPrices = async (offsetValue = 0) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=${LIMIT}&offset=${offsetValue}`
      );
      const json = await res.json();
      if (json.records && json.records.length > 0) {
        setData((prev) => [...prev, ...json.records]);
        setHasMore(json.records.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching mandi data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices(offset);
    const interval = setInterval(() => fetchPrices(offset), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter((item) => {
      const commoditySearch = Object.keys(commodityMap).find((key) =>
        lowerSearch.includes(key)
      );

      const matchesCommodity =
        commoditySearch && commodityMap[commoditySearch].includes(item.commodity)
          ? true
          : item.commodity.toLowerCase().includes(lowerSearch);

      const matchesMarket = item.market.toLowerCase().includes(lowerSearch);
      const matchesState = item.state.toLowerCase().includes(lowerSearch);
      const matchesDistrict = item.district.toLowerCase().includes(lowerSearch);

      return matchesCommodity || matchesMarket || matchesState || matchesDistrict;
    });
    setFilteredData(filtered);
  }, [search, data]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchPrices(newOffset);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl">
      {/* Animated Title */}
      <motion.h2
        className="text-3xl font-bold text-green-800 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        🌾 Live Indian Mandi Prices
      </motion.h2>

      {/* Search Input */}
      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search by Commodity, Market, State, or District"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Animated Cards */}
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No results found...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredData.map((item, i) => (
              <motion.div
                key={item.market + item.commodity + i} // unique key
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-5 rounded-2xl shadow-lg border-l-4 border-green-500 hover:scale-105 transform transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  {item.commodity} ({item.variety})
                </h3>
                <p className="text-green-700 mb-1"><b>Market:</b> {item.market}</p>
                <p className="text-green-700 mb-1"><b>District:</b> {item.district}</p>
                <p className="text-green-700 mb-1"><b>State:</b> {item.state}</p>
                <p className="text-green-700 mb-1"><b>Price:</b> ₹{item.modal_price}/quintal</p>
                <p className="text-green-700 mb-1">
                  <b>Min:</b> ₹{item.min_price} | <b>Max:</b> ₹{item.max_price}
                </p>
                <p className="text-green-700"><b>Date:</b> {item.arrival_date}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
