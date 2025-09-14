import axios from "axios";

const baseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5002/api" // seu backend local
    : "https://basybee.com.br/api"; // produção

const makeRequest = axios.create({
  baseURL,
  withCredentials: true, // necessário se usar cookies no backend
});

makeRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const tokenData = localStorage.getItem("sistema-cadastro-keite:token");
      if (tokenData) {
        const { token } = JSON.parse(tokenData);
        if (token && config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default makeRequest;
