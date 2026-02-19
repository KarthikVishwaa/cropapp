import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Grid, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeaturesSheet from "./FeaturesSheet";

export default function BottomPillNav() {
  const [openFeatures, setOpenFeatures] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {/* Bottom pill bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
        <div
          className="flex items-center gap-10 px-6 sm:px-8 py-3
          bg-white/90 backdrop-blur-md
          rounded-full shadow-xl border"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs font-medium
              ${
                isActive ? "text-green-600" : "text-gray-500"
              }`
            }
          >
            <Home className="w-6 h-6" />

            {/* Prevent long language overflow */}
            <span className="whitespace-nowrap">
              {t("home")}
            </span>
          </NavLink>

          {/* FEATURES BUTTON */}
          <button
            onClick={() => setOpenFeatures(true)}
            className="flex flex-col items-center text-xs font-medium text-gray-600 active:scale-95"
          >
            <Grid className="w-6 h-6" />

            <span className="whitespace-nowrap">
              {t("features")}
            </span>
          </button>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs font-medium
              ${
                isActive ? "text-green-600" : "text-gray-500"
              }`
            }
          >
            <Info className="w-6 h-6" />

            <span className="whitespace-nowrap">
              {t("about")}
            </span>
          </NavLink>
        </div>
      </div>

      {/* Sliding Features Window */}
      <FeaturesSheet
        open={openFeatures}
        onClose={() => setOpenFeatures(false)}
      />
    </>
  );
}
