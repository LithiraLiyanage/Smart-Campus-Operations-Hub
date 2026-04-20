import axios from "axios";

// ─── Token Helper ────────────────────────────────────────────────────────────
// Swap this one function to move from userId → JWT bearer token later
const getToken = () => localStorage.getItem("userId");

// ─── Axios Instance ───────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Attaches userId ONLY when it exists — routes that don't need it are unaffected
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Swap line below to: config.headers["Authorization"] = `Bearer ${token}`;
      // when you move to JWT
      config.headers["X-User-Id"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";
    console.error("[API Error]", message);
    return Promise.reject({ message, status: error.response?.status });
  }
);

// ─── Auth Endpoints ───────────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  api.post("/login", { email, password });

export const registerUser = (userData) => api.post("/users", userData);

// ─── User Endpoints ───────────────────────────────────────────────────────────
export const getUserById = (id) => api.get(`/users/${id}`);

export const getAllUsers = () => api.get("/users");

export const updateUser = (id, userData) => api.put(`/users/${id}`, userData);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
