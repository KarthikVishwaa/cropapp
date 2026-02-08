import { NavLink } from "react-router-dom";

const features = [
  { path: "/diary", name: "Digital Crop Diary" },
  { path: "/schemes", name: "Farm News & Schemes" },
  { path: "/weather", name: "Live Weather" },
  { path: "/crop", name: "Crop Recommendation" },
  { path: "/disease", name: "Plant Disease Detection" },
  { path: "/weed", name: "Weed & Soil Health" },
  { path: "/yield", name: "Yield Estimation" },
  { path: "/map", name: "Farm Location Mapping" },
 { path: "/calendar", name: "Crop Calendar & Alerts", isNew: true },
{ path: "/ai-fertilizer", name: "AI Fertilizer Advisor", isNew: true }

];

export default function FeaturesSheet({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-[9998]"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999]
        bg-white rounded-t-[28px] shadow-2xl
        transform transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
        ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ height: "85vh" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pt-4 pb-2 border-b">
          <h2 className="text-lg font-semibold">All Features</h2>
          <p className="text-sm text-gray-500">
            Crop Sense tools
          </p>
        </div>

        <div className="px-6 py-4 space-y-3 overflow-y-auto h-[calc(85vh-120px)]">
   {features.map(item => (
  <NavLink
    key={item.path}
    to={item.path}
    onClick={onClose}
    className={`flex items-center justify-between
      px-4 py-3 rounded-2xl
      font-medium transition
      ${
        item.isNew
          ? "bg-green-100 border border-green-300"
          : "bg-gray-100 hover:bg-gray-200"
      }
    `}
  >
    <span className="text-gray-800">{item.name}</span>

    {item.isNew && (
      <span className="text-xs font-semibold px-2 py-0.5
        bg-green-600 text-white rounded-full">
        NEW
      </span>
    )}
  </NavLink>


          ))}
        </div>
      </div>
    </>
  );
}
