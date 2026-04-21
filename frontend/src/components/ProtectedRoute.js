import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles, children }) {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(rawUser);
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
