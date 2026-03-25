import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5454";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Routes qui ne doivent JAMAIS déclencher un logout automatique
const SOFT_ROUTES = [
  "/api/users/activity",
  "/api/p2p/trades/my",
  "/api/users/kyc/token",
  "/api/users/verification",
  "/api/users/onboarding",
  "/api/users/phone",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    const isSoft = SOFT_ROUTES.some((r) => url.includes(r));
    if (error.response?.status === 401 && !isSoft) {
      localStorage.removeItem("jwt");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
