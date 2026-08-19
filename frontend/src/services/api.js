import axios from "axios";

const api = axios.create({
  baseURL:"https://quiz-platform-backend-h8av.onrender.com/api"
});

export default api;