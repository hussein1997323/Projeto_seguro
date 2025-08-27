import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://basybee.com.br/api/",
  withCredentials: true, // IMPORTANTE se backend usar cookies
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
  (error) => {
    return Promise.reject(error);
  }
);

export default makeRequest;
