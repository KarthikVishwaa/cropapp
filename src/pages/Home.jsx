import React from "react";
import { useTranslation } from "react-i18next";
import { CloudSun, Sprout, Leaf, MessageCircle, MapPin } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-20 md:py-28 overflow-hidden">
        
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
            alt="Farm background"
            className="w-full h-full object-cover opacity-40"
          />
        </div>

        {/* Responsive + Language Safe Title */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-green-800 mb-4 leading-tight break-words">
          {t("heroTitle")}
        </h1>

        {/* Prevent overflow on long translations */}
        <p className="text-base sm:text-lg md:text-xl text-green-900 max-w-2xl mb-6 leading-relaxed break-words">
          {t("heroSubtitle")}
        </p>

        <a
          href="#features"
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition whitespace-nowrap"
        >
          {t("exploreFeatures")}
        </a>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-green-800 mb-8 sm:mb-12 break-words">
          {t("featuresHeading")}
        </h2>

        {/* Grid fully responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8 max-w-6xl mx-auto">
          
          {[
            {
              icon: <CloudSun className="w-10 h-10 text-green-600" />,
              title: t("weatherFeatureTitle"),
              desc: t("weatherFeatureDesc"),
            },
            {
              icon: <Sprout className="w-10 h-10 text-green-600" />,
              title: t("cropFeatureTitle"),
              desc: t("cropFeatureDesc"),
            },
            {
              icon: <Leaf className="w-10 h-10 text-green-600" />,
              title: t("diseaseFeatureTitle"),
              desc: t("diseaseFeatureDesc"),
            },
            {
              icon: <MapPin className="w-10 h-10 text-green-600" />,
              title: t("marketFeatureTitle"),
              desc: t("marketFeatureDesc"),
            },
            {
              icon: <MessageCircle className="w-10 h-10 text-green-600" />,
              title: t("communityFeatureTitle"),
              desc: t("communityFeatureDesc"),
            },
            {
              icon: <Sprout className="w-10 h-10 text-green-600" />,
              title: t("toolsFeatureTitle"),
              desc: t("toolsFeatureDesc"),
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-green-50 rounded-2xl p-4 sm:p-6 text-center shadow hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-3">{f.icon}</div>

              {/* Prevent title overflow */}
              <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-1 break-words">
                {f.title}
              </h3>

              <p className="text-green-700 text-sm leading-relaxed break-words">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-14 sm:py-20 px-4 bg-gradient-to-r from-green-600 to-lime-600 text-center text-white">
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 break-words">
          {t("ctaTitle")}
        </h2>

        <p className="mb-5 sm:mb-8 text-sm sm:text-lg break-words">
          {t("ctaSubtitle")}
        </p>

        <a
          href="/signup"
          className="bg-white text-green-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-lg hover:bg-green-100 transition whitespace-nowrap"
        >
          {t("getStarted")}
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 bg-green-900 text-center text-green-100 text-xs sm:text-sm break-words">
        © {new Date().getFullYear()} CropSense — {t("footerTagline")}
      </footer>
    </div>
  );
}
