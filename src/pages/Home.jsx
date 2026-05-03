import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudSun, Sprout, Leaf, MessageCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "../component/AuthModal";
import ProfileAvatar from "../component/ProfileAvatar";
import LanguageSwitcher from "../component/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [pendingPath, setPendingPath] = useState("/");

  const goToFeature = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      setPendingPath(path);
      setShowModal(true);
    }
  };

  const features = [
    {
      icon: <CloudSun className="w-10 h-10 text-green-600" />,
      title: t("weatherFeatureTitle"),
      desc: t("weatherFeatureDesc"),
      path: "/weather",
    },
    {
      icon: <Sprout className="w-10 h-10 text-green-600" />,
      title: t("cropFeatureTitle"),
      desc: t("cropFeatureDesc"),
      path: "/crop",
    },
    {
      icon: <Leaf className="w-10 h-10 text-green-600" />,
      title: t("diseaseFeatureTitle"),
      desc: t("diseaseFeatureDesc"),
      path: "/disease",
    },
    {
      icon: <MapPin className="w-10 h-10 text-green-600" />,
      title: t("marketFeatureTitle"),
      desc: t("marketFeatureDesc"),
      path: "/market",
    },
    {
      icon: <MessageCircle className="w-10 h-10 text-green-600" />,
      title: t("communityFeatureTitle"),
      desc: t("communityFeatureDesc"),
      path: "/community",
    },
    {
      icon: <Sprout className="w-10 h-10 text-green-600" />,
      title: t("toolsFeatureTitle"),
      desc: t("toolsFeatureDesc"),
      path: "/yield",
    },
  ];

  return (
    <>
      <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">

        {/* ── TOP RIGHT: Language + Profile/SignIn ── */}
        <div className="fixed top-4 right-4 z-[9999] flex items-center gap-2">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <ProfileAvatar />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-full shadow hover:bg-green-700 transition"
            >
              Sign In
            </button>
          )}
        </div>

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
              alt="Farm background"
              className="w-full h-full object-cover opacity-40"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-green-800 mb-4 leading-tight break-words">
            {t("heroTitle")}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-green-900 max-w-2xl mb-6 leading-relaxed break-words">
            {t("heroSubtitle")}
          </p>

          {/* Changed <a> to <button> to fix JSX parsing error */}
          <button
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition whitespace-nowrap"
          >
            {t("exploreFeatures")}
          </button>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-800 mb-8 sm:mb-12 break-words">
            {t("featuresHeading")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <button
                key={i}
                onClick={() => goToFeature(f.path)}
                className="bg-green-50 rounded-2xl p-4 sm:p-6 text-center shadow hover:shadow-lg transition cursor-pointer w-full border-0 text-left"
              >
                <div className="flex justify-center mb-3">{f.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-1 break-words text-center">
                  {f.title}
                </h3>
                <p className="text-green-700 text-sm leading-relaxed break-words text-center">
                  {f.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-14 sm:py-20 px-4 bg-gradient-to-r from-green-600 to-lime-600 text-center text-white">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 break-words">
            {t("ctaTitle")}
          </h2>
          <p className="mb-5 sm:mb-8 text-sm sm:text-lg break-words">
            {t("ctaSubtitle")}
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-green-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:bg-green-100 transition whitespace-nowrap"
          >
            {t("getStarted")}
          </button>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-6 sm:py-8 bg-green-900 text-center text-green-100 text-xs sm:text-sm break-words">
          © {new Date().getFullYear()} CropSense — {t("footerTagline")}
        </footer>

      </div>

      {/* ── AUTH MODAL ── */}
      {showModal && (
        <AuthModal
          onLogin={() => {
            setShowModal(false);
            navigate("/login", { state: { from: { pathname: pendingPath } } });
          }}
          onSignup={() => {
            setShowModal(false);
            navigate("/signup");
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}