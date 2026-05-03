import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./component/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";

import LanguageSwitcher from "./component/LanguageSwitcher.jsx";
import InstallAppBanner from "./component/InstallAppBanner";
import WeatherWidget from "./component/WeatherWidget";
import CropRecommendation from "./component/CropRecommendation";
import DiseaseDetection from "./component/DiseaseDetection";
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
import ExpertSelection from "./component/ExpertSelection.jsx";
import ChatPage from "./component/ChatPage.jsx";
import CommunityForum from "./component/CommunityForum.jsx";
import PriceForecastingModule from "./component/PriceForcast.jsx";
import ProfileAvatar from "./component/ProfileAvatar";

// Shell for protected feature pages
const Shell = ({ children }) => (
  <ProtectedRoute>
    <div className="font-sans pb-28">
      <div className="fixed top-4 right-4 z-[9999]">
        <ProfileAvatar />
      </div>
      <div className="fixed top-4 left-16 z-[9999]">
        <LanguageSwitcher />
      </div>
      {children}
      <InstallAppBanner />
      <BottomPillNav />
    </div>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ── PUBLIC ── */}
          <Route path="/"       element={<Home />} />
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── PROTECTED FEATURES ── */}
          <Route path="/about"           element={<Shell><About /></Shell>} />
          <Route path="/contact"         element={<Shell><Contact /></Shell>} />
          <Route path="/weather"         element={<Shell><WeatherWidget /></Shell>} />
          <Route path="/crop"            element={<Shell><CropRecommendation /></Shell>} />
          <Route path="/disease"         element={<Shell><DiseaseDetection /></Shell>} />
          <Route path="/calendar"        element={<Shell><CropCalendar /></Shell>} />
          <Route path="/ai-fertilizer"   element={<Shell><AIFertilizerAdvisor /></Shell>} />
          <Route path="/market"          element={<Shell><MarketPricePrediction /></Shell>} />
          <Route path="/irrigation"      element={<Shell><IrrigationCalculator /></Shell>} />
          <Route path="/experts"         element={<Shell><ExpertSelection /></Shell>} />
          <Route path="/expert"          element={<Shell><ChatPage /></Shell>} />
          <Route path="/chat"            element={<Shell><Chat /></Shell>} />
          <Route path="/chat/:profileId" element={<Shell><ChatPage /></Shell>} />
          <Route path="/community"       element={<Shell><CommunityForum /></Shell>} />
          <Route path="/forum"           element={<Shell><Forum /></Shell>} />
          <Route path="/schemes"         element={<Shell><GovernmentSchemes /></Shell>} />
          <Route path="/diary"           element={<Shell><DigitalCropDiary /></Shell>} />
          <Route path="/weed"            element={<Shell><WeedDetectionSoilHealth /></Shell>} />
          <Route path="/yield"           element={<Shell><YieldEstimationTool /></Shell>} />
          <Route path="/map"             element={<Shell><FarmLocationMapping /></Shell>} />
          <Route path="/price-forecast"  element={<Shell><PriceForecastingModule /></Shell>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}