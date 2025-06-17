import axios from "axios";

const makeRequest = axios.create({
  baseURL: "http://localhost:5002/api",
});

export default makeRequest;
