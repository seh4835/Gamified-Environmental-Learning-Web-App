import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Leaderboard from "../pages/Leaderboard";
import Challenges from "../pages/Challenges";
import Modules from "../pages/Modules";
import ModuleDetail from "../pages/ModuleDetail";
import Admin from "../pages/Admin";
import Submissions from "../pages/Submissions";
// Route Protection
import ProtectedRoute from "./ProtectedRoute";

// Layout (optional but recommended)
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AppRoutes = () => {
  return (
    <Router>
      {/* Global Layout */}
      <Navbar />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED USER ROUTES ================= */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:id" element={<ModuleDetail />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/submissions" element={<Submissions />} />
        </Route>

        {/* ================= 404 ROUTE ================= */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default AppRoutes;