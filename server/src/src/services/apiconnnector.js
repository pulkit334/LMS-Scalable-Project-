/* eslint-disable no-unused-vars */
import axios from "axios";
import toast from "react-hot-toast";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const code = error?.response?.data?.code;
    if (status === 403 && code === "ACCOUNT_DELETED REQUEST IS SUBMITTED") {
      localStorage.clear();
      sessionStorage.clear();
      window.location.replace("/account-deactivated");
    }
    if (status == 400 && code === "USER_NOT_FOUND") {
      throw new Error("User Does Not Exist");
    } 
    if (status == 500 && code === "INTERNAL_SERVER_ERROR") {
      throw new Error("Something went wrong. Please try again later."); 
    }
    return Promise.reject(error.message);
  }
);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiConnector = (method, url, bodydata, headers, params) => {
  return api({
    method: `${method}`,
    url: `${url}`,
    data: bodydata ? bodydata : null,
    headers: {
      ...headers,
    },
    params: params ? params : null,
  });
};
