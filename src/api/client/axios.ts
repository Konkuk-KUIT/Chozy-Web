import axios from "axios";
import { getAccessToken, getTokenType } from "./auth";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://chozy.net",
  withCredentials: false,
});

// 요청마다 토큰 자동 주입
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const type = getTokenType();
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${type} ${token}`;
  }
  return config;
});
