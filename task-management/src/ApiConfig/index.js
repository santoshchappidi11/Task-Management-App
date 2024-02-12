import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://task-management-1nr1.onrender.com",
});

export default api;
