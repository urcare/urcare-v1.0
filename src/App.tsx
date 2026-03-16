import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSafariMobileFix } from "./hooks/useSafariMobileFix";

import LandingDiabetes from "./pages/LandingDiabetes";
import AboutUs from "./pages/AboutUs";

function App() {
  useSafariMobileFix();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingDiabetes />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="*" element={<LandingDiabetes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;