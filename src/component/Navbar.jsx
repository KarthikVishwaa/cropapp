import { useState } from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/diary", name: "Digital Crop Diary" },
  { path: "/schemes", name: "Farm News" },
  { path: "/weather", name: "Live Weather" },
  { path: "/crop", name: "Crop Recommendation" },
  { path: "/disease", name: "Plant Disease Identification" },
  { path: "/weed", name: "Weed Detection & Soil Health" },
  { path: "/yield", name: "Yield Estimation Tool" },
  { path: "/map", name: "Farm Location Mapping" },
];

export default function MobileSlideUpMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bottom handle / trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pb-2">
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition"
        >
          Menu
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-up panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-500 ease-out
        ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "85vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-3 border-b">
          <h2 className="text-lg font-bold text-green-700">
            Crop Sense Menu
          </h2>
          <p className="text-sm text-gray-500">
            Access all features
          </p>
        </div>

        {/* Nav links */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto h-[calc(85vh-120px)]">
          {navLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition
                ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
