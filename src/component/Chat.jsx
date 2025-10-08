import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PhoneCall, Mail, Search } from "lucide-react";
import agriOffices from "../data/agriOffices.json";

export default function Chart() {
  const [searchTerm, setSearchTerm] = useState("");

  // Add random farm numbers (replace with real data if available)
  const districtData = agriOffices.map((item) => ({
    ...item,
    farms: Math.floor(Math.random() * 2000) + 800,
  }));

  // Filter based on search term
  const filteredDistricts = districtData.filter((d) =>
    d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-12 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-10">
        Tamil Nadu Agriculture Support Dashboard
      </h1>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-5xl mx-auto mb-12">
        <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
          Number of Registered Farms per District
        </h2>

        <ResponsiveContainer width="100%" height={350}>
  <BarChart
    data={
      searchTerm
        ? filteredDistricts.filter((d) => d.district !== "General Helpline")
        : []
    }
    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
    <XAxis
      dataKey="district"
      tick={{ fill: "#065f46", fontSize: 11 }}
      interval={0}
    />
    <YAxis tick={{ fill: "#065f46" }} />
    <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
    <Bar dataKey="farms" fill="#16a34a" radius={[6, 6, 0, 0]} />
  </BarChart>
</ResponsiveContainer>

      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-green-600 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by district name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-green-800"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block max-w-6xl mx-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-2xl shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">District</th>
                <th className="py-3 px-4 text-left">Office / Designation</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((d, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-green-50 transition text-green-900"
                  >
                    <td className="py-3 px-4 font-semibold">{d.district}</td>
                    <td className="py-3 px-4">{d.office}</td>
                    <td className="py-3 px-4">{d.phone || "—"}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      {d.email && d.email !== "--" ? (
                        <>
                          <Mail className="w-4 h-4 text-green-600" />
                          <a
                            href={`mailto:${d.email}`}
                            className="text-green-700 hover:underline"
                          >
                            {d.email}
                          </a>
                        </>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {d.phone && d.phone !== "--" ? (
                        <a
                          href={`tel:${d.phone}`}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                        >
                          <PhoneCall className="w-4 h-4" />
                          Call
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-green-700 italic"
                  >
                    No districts found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden max-w-6xl mx-auto space-y-4">
        {filteredDistricts.length > 0 ? (
          filteredDistricts.map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-4 border-l-4 border-green-500"
            >
              <h3 className="font-semibold text-green-800 mb-1">{d.district}</h3>
              <p className="text-sm text-green-700">
                <span className="font-semibold">Office:</span> {d.office}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-semibold">Phone:</span> {d.phone || "N/A"}
              </p>
              <p className="text-sm text-green-700 flex items-center gap-2">
                <span className="font-semibold">Email:</span>
                {d.email && d.email !== "--" ? (
                  <a
                    href={`mailto:${d.email}`}
                    className="text-green-700 hover:underline"
                  >
                    {d.email}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              {d.phone && d.phone !== "--" && (
                <a
                  href={`tel:${d.phone}`}
                  className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition text-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-green-700 italic">
            No districts found for "{searchTerm}"
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 mt-12 bg-green-900 text-center text-green-100 text-sm rounded-t-2xl">
        © {new Date().getFullYear()} CropSense.com — Tamil Nadu Agriculture Support
      </footer>
    </div>
  );
}
