import axios from "axios";

const baseURL = "http://localhost:5219/api";

export const API = axios.create({ baseURL });

API.interceptors.request.use((config) => {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const PublicAPI = axios.create({ baseURL });

export default API;
