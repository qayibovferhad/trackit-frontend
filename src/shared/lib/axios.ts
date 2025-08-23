import axios from "axios";
import { getAccessToken, setAccessToken } from "./authStorage";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let accessToken: string | null = getAccessToken();

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function redirectToLogin() {
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error?.response?.status;

    if (original?.url?.includes("/auth/refresh") || status !== 401) {
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        setAccessToken(data.accessToken);
        isRefreshing = false;
        pendingQueue.forEach((cb) => cb(data.accessToken));
        pendingQueue = [];
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        isRefreshing = false;
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        setAccessToken(null);
        redirectToLogin();
        return Promise.reject(refreshErr);
      }
    }

    return new Promise((resolve, reject) => {
      pendingQueue.push((newToken) => {
        if (!newToken) return reject(error);
        original.headers.Authorization = `Bearer ${newToken}`;
        resolve(api(original));
      });
    });
  }
);
