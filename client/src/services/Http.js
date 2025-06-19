import axios from "axios";
import { BASE_API } from "../shared/constants/app";

const Http = axios.create({
  baseURL: BASE_API,
});

// Gắn accessToken từ localStorage vào mỗi request
Http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Http;
