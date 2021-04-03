import axios from "axios";
import { toast } from "react-toastify";
import userService from "../services/userService";
import createAuthRefreshInterceptor from "axios-auth-refresh";

axios.defaults.baseURL = `http://localhost:3001/api`;

axios.defaults.headers.common["x-auth-token"] = userService.getJwt();

axios.interceptors.response.use(null, (err) => {
  if (err.response && err.response > 403) {
    toast.error("An unexpected error occurred");
  }
  return Promise.reject(err);
});

////// check if the token expired return refresh_Token and if refresh Token expired return the user to log in
const refreshAuthLogic = (failedRequest) => {
  return axios
    .post("/auth/refreshToken", {
      refreshToken: localStorage.getItem("reftoken"),
    })
    .then((tokenRefreshResponse) => {
      console.dir(tokenRefreshResponse);
      localStorage.setItem("token", tokenRefreshResponse.data.token);
      localStorage.setItem("reftoken", tokenRefreshResponse.data.refreshToken);
      axios.defaults.headers.common["x-auth-token"] =
        tokenRefreshResponse.data.token;
      failedRequest.response.config.headers["x-auth-token"] =
        tokenRefreshResponse.data.token;

      return Promise.resolve();
    })
    .catch((err) => {
      if (err.response && err.response.status === 400) {
        localStorage.removeItem("token");
        localStorage.removeItem("reftoken");
        toast.error(`you need to login again`);
        window.location.pathname = "/signin";
      }
    });
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

const services = {
  get: axios.get,
  put: axios.put,
  patch: axios.patch,
  post: axios.post,
  delete: axios.delete,
};
export default services;
