import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
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
// ✅ Add this line

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Navbar />

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/weather" element={<WeatherWidget />} />
            <Route path="/crop" element={<CropRecommendation />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/market" element={<MarketPrices />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/diary" element={<DigitalCropDiary />} />
<Route path="/schemes" element={<GovernmentSchemes />} />
<Route path="/weed" element={<WeedDetectionSoilHealth />} />
<Route path="/yield" element={<YieldEstimationTool />} />
 {/* ✅ New route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
