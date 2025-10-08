// src/App.jsx
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
