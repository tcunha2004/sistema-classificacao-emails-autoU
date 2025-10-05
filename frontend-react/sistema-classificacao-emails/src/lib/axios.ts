// lib/axios.ts

import axios from "axios";

// Prefer environment variable (Vite) and fallback to '/api' which nginx proxies to backend
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({
  baseURL,
});
