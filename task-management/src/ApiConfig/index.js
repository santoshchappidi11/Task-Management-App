import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-1nr1.onrender.com",
});

export default api;
