/* eslint-disable no-unused-vars */
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshVerification } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BASE_URL,
  withCredentials: true,
});
export const AiApi = axios.create({
  baseURL: import.meta.env.VITE_AI_BASE_URL,
  withCredentials: true,
});

export const LiveClassAPI = axios.create({
  baseURL: import.meta.env.VITE_LIVE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    const originalRequest = error.config;
    if (status === 403 && code === "ACCOUNT_DELETED REQUEST IS SUBMITTED") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/account-deactivated");
    }
    if (status == 400 && code === "USER_NOT_FOUND") {
      throw new Error("User Does Not Exist");
    }
    if (
      status === 403 &&
      code === "Account Have Been Blocked Kindly Connect To Company"
    ) {
      toast.error("Your account has been blocked. Please contact support.");

      return Promise.reject(error);
    }

    if (status == 500 && code === "INTERNAL_SERVER_ERROR") {
      throw new Error("Something went wrong. Please try again later.");
    }
    //if Refresh Token Expired Then Logout From Here
    if (status === 401 && code === "REFRESH_TOKEN_EXPIRED") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/login");
    }

    if (
      status === 401 &&
      code === "ACCESS_TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = RefreshVerification()
          .then((refData) => {
            const newToken = refData.token;
            localStorage.setItem("token", newToken);

            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
            return newToken;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//Admin APi
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
//Ai Api
AiApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
//Live Class APi

LiveClassAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config 
})