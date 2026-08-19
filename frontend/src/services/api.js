import axios from "axios";

const api = axios.create({
  baseURL: "http://quiz_platform_backend.onrender.com/api"
});

export default api;