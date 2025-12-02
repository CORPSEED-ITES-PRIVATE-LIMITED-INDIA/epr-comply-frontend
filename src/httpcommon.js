import axios from "axios";

export const api = axios.create({
  baseURL: `/`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});
