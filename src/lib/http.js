import axios from "axios";

/**
 * Browser-side client. Requests stay same-origin and are proxied to Spring
 * Boot by the rewrites in next.config.mjs, so session cookies keep working and
 * no CORS preflight is added.
 */
export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});
