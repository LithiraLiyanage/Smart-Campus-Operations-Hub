import { useState, useEffect } from "react";

/**
 * useAuth
 * Simple auth state hook based on localStorage userId.
 * Replace with JWT decode + context later.
 */
const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) {
      setUserId(stored);
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setIsAuthenticated(false);
  };

  return { userId, isAuthenticated, logout };
};

export default useAuth;
