import http from "./http";
import jwtDecode from "jwt-decode";

const tokenKey = "token";
const REFRESHTOKEN = "reftoken";

export function getUserInfo() {
  return http.get(`/users/me`).then((resp) => resp.data);
}
export function createUser(data) {
  return http.post(`/users`, data);
}

export function getUserInfoWithPass() {
  return http.get(`/users/accMe`).then((resp) => resp.data);
}

// מציג את כל המוצרים שהוספנו לעגלה או למועדפים
export function getCardByNumber(arr) {
  return http.get(`/users/prods/?numbers=${arr}`);
}

export function favorite(prodNumber) {
  const dataBody = {
    prods: [prodNumber],
  };
  return http.put(`/users/fav`, dataBody);
}

export function myCart(prodNumber) {
  const dataBody = {
    carts: [prodNumber],
  };
  return http.put(`/users/my-cart`, dataBody);
}

export function changeName(name) {
  return http.put("/users/edit", name);
}

export function passChange(password, newPassword) {
  return http.put(`/users/changePassword`, { password, newPassword });
}

export function updateOneUser(user) {
  const userId = user._id;
  return http.put(`/users/${userId}`, user);
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function logOut() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(REFRESHTOKEN);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch {
    return null;
  }
}

export async function login(email, password) {
  const { data } = await http.post(`/auth`, { email, password });
  localStorage.setItem(tokenKey, data.token);
  localStorage.setItem(REFRESHTOKEN, data.refreshToken);
}

const service = {
  getCurrentUser,
  login,
  logOut,
  getJwt,
  getUserInfo,
  updateOneUser,
  getUserInfoWithPass,
  passChange,
  getCardByNumber,
  favorite,
  myCart,
  changeName,
  createUser,
};

export default service;
