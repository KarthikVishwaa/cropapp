import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-green-200 shadow-sm rounded-full px-3 py-1.5">
      
      {/* Globe Icon */}
      <Globe className="w-4 h-4 text-green-700" />

      {/* Dropdown */}
      <select
        onChange={changeLang}
        value={i18n.language}
        className="bg-transparent text-green-800 text-sm font-medium focus:outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिन्दी</option>
        <option value="te">తెలుగు</option>
        <option value="kn">ಕನ್ನಡ</option>
      </select>
    </div>
  );
}
