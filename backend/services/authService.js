import axios from "axois";


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};
