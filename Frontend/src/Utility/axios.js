import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: "https://http://localhost:5000/api",
});

export default axiosBaseURL;
export const axiosImageURL = "http://localhost:5000";
