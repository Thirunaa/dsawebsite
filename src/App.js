import React from "react";
import HomePage from "./pages/HomePage.js";
import ProblemList from "./components/library/ProblemList.js";
import ProblemPage from "./pages/ProblemPage.js";
import TopicsPage from "./pages/TopicsPage.js";
import FeaturesPage from "./pages/FeaturesPage.js";
import VisualizerPage from "./pages/VisualizerPage.js";
import "./App.css";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/library" element={<ProblemList />} />
            <Route path="/lesson/:id" element={<ProblemPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/visualizer/:lcNumber" element={<VisualizerPage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
