import axios from "axios";

const STORAGE_KEY = "q10_access_token";
const COOKIE_NAME = "q10_at";
let accessToken: string | null = null;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

if (typeof window !== "undefined") {
  accessToken = getCookie(COOKIE_NAME) || localStorage.getItem(STORAGE_KEY);
}

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
      setCookie(COOKIE_NAME, token, 7);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      removeCookie(COOKIE_NAME);
    }
  }
}

export function getAccessToken() {
  return accessToken;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
        return api(originalRequest);
      } catch {
        setAccessToken(null);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
