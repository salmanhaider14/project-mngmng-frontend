import axios from "axios";

const API_BASE_URL = "https://project-mngmnt-backend.vercel.app/api/"; // Replace with your API base URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

const authConfig = (token) => {
  return {
    headers: {
      Authorization: `${token}`,
    },
  };
};

const API = {
  get: (url, token = null) => {
    const config = token ? authConfig(token) : {};
    return axiosInstance.get(url, config);
  },

  post: (url, data = {}, token = null) => {
    const config = token ? authConfig(token) : {};
    return axiosInstance.post(url, data, config);
  },

  put: (url, data = {}, token = null) => {
    const config = token ? authConfig(token) : {};
    return axiosInstance.put(url, data, config);
  },

  delete: (url, token = null) => {
    const config = token ? authConfig(token) : {};
    return axiosInstance.delete(url, config);
  },
};

export default API;
