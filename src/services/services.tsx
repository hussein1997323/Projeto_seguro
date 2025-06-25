import axios from "axios";

const makeRequest = axios.create({
  baseURL: "",
});

export default makeRequest;
