import axios from "axios";

const BASE_URL = "https://dev-haven.mahesvara.me/api/v1/";

export const API_ENDPOINTS = {
    AUTH: {
        REGISTER_CUSTOMER: `${BASE_URL}auth/register-customer`,
        LOGIN: `${BASE_URL}auth/login`,
    },
    USER: {
      ME: `${BASE_URL}auth/me`,
      UPDATE_ME: `${BASE_URL}users`,
    },
    TRANSACTION: {
      CREATE_TICKET: `${BASE_URL}transaction`,
    },
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
