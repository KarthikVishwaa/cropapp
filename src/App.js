import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LanguageSwitcher from "./component/LanguageSwitcher.jsx";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import InstallAppBanner from "./component/InstallAppBanner";
import WeatherWidget from "./component/WeatherWidget";
import CropRecommendation from "./component/CropRecommendation";
import DiseaseDetection from "./component/DiseaseDetection";
import MarketPrices from "./component/MarketPrices";
import Chat from "./component/Chat";
import Forum from "./component/Forum";
import GovernmentSchemes from "./component/GovernmentSchemes";
import DigitalCropDiary from "./component/DigitalCropDiary";
import WeedDetectionSoilHealth from "./component/WeedDetectionSoilHealth";
import YieldEstimationTool from "./component/YieldEstimationTool";
import FarmLocationMapping from "./component/FarmLocationMapping";
import BottomPillNav from "./component/BottomPillNav";
import CropCalendar from "./component/CropCalendar";
import AIFertilizerAdvisor from "./component/AIFertilizerAdvisor";
import MarketPricePrediction from "./component/MarketPricePrediction.jsx";
import IrrigationCalculator from "./component/IrrigationCalculator.jsx";
import ChatWithAgriExpert from "./component/ChatPage.jsx";
import ExpertSelection from "./component/ExpertSelection.jsx";
import ChatPage from "./component/ChatPage.jsx";
import CommunityForum from "./component/CommunityForum.jsx";

function App() {
  return (
    <Router>

      {/* ✅ Language Switcher (Top Right) */}
      <div className="fixed top-4 right-4 z-[9999]">
        <LanguageSwitcher />
      </div>

      <div className="font-sans pb-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/calendar" element={<CropCalendar />} />
          <Route path="/ai-fertilizer" element={<AIFertilizerAdvisor />} />
<Route path="/market" element={<MarketPricePrediction />} />
<Route path="/expert" element={<ChatWithAgriExpert />} />
<Route path="/Irrigation" element={<IrrigationCalculator/>} />
          <Route path="/weather" element={<WeatherWidget />} />
          <Route path="/crop" element={<CropRecommendation />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/market" element={<MarketPrices />} />
          <Route path="/chat" element={<Chat />} />
       <Route path="/experts" element={<ExpertSelection />} />
<Route path="/chat/:profileId" element={<ChatPage />} />

<Route path="/community" element={<CommunityForum/>} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/schemes" element={<GovernmentSchemes />} />
          <Route path="/diary" element={<DigitalCropDiary />} />
          <Route path="/weed" element={<WeedDetectionSoilHealth />} />
          <Route path="/yield" element={<YieldEstimationTool />} />
          <Route path="/map" element={<FarmLocationMapping />} />
        </Routes>

        <InstallAppBanner />
        <BottomPillNav />
      </div>
    </Router>
  );
}

export default App;
