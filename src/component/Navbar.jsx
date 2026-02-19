import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const navLinks = [
  { path: "/", key: "home" },
  { path: "/about", key: "about" },
  { path: "/diary", key: "digitalDiary" },
  { path: "/schemes", key: "farmNews" },
  { path: "/weather", key: "liveWeather" },
  { path: "/crop", key: "cropRecommendation" },
  { path: "/disease", key: "diseaseIdentification" },
  { path: "/weed", key: "weedSoilHealth" },
  { path: "/yield", key: "yieldTool" },
  { path: "/map", key: "farmMapping" },
];

export default function MobileSlideUpMenu() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {/* Bottom handle / trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] flex justify-center pb-2">
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-full shadow-lg active:scale-95 transition whitespace-nowrap"
        >
          {t("menu")}
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
          <h2 className="text-lg font-bold text-green-700 break-words">
            {t("appMenuTitle")}
          </h2>

          <p className="text-sm text-gray-500 break-words">
            {t("appMenuSubtitle")}
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
                `block px-4 py-3 rounded-xl text-base font-medium transition break-words
                ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "bg-green-50 text-green-800 hover:bg-green-100"
                }`
              }
            >
              {/* Language-safe label */}
              <span className="whitespace-normal">
                {t(item.key)}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
}
