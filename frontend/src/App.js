import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function HomeRedirect() {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return <Navigate to="/login" replace />;

  const user = JSON.parse(rawUser);
  if (user.role === "STUDENT") return <Navigate to="/student-dashboard" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin-dashboard" replace />;
  if (user.role === "TECHNICIAN") return <Navigate to="/technician-dashboard" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/technician-dashboard" element={<ProtectedRoute allowedRoles={["TECHNICIAN"]}><TechnicianDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
