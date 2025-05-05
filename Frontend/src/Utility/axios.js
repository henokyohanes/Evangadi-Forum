import axios from "axios";

const axiosBaseURL = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
});

export default axiosBaseURL;
export const axiosImageURL = import.meta.env.VITE_API_URL;