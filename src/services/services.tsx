import axios from "axios";

const makeRequest = axios.create({
  baseURL: "https://husseindev.com.br/",
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
