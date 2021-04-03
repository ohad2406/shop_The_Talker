import http from "./http";

export function createProd(prod) {
  return http.post(`/prods`, prod);
}
export function getAllProds(page) {
  return http.get(`/prods?page=${page}`);
}
export function getpage(pageNumber) {
  return http.get(`/prods?page=${pageNumber}`);
}
export function getOneProd(id) {
  return http.get(`/prods/${id}`);
}
export function getProdsAccorToGender(
  prodType,
  page = 0,
  perPage = 12,
  reverse = false
) {
  return http.get(
    `/prods/${prodType}/gender?page=${page}&perPage=${perPage}&reverse=${reverse}`
  );
}
export function updateProd(id, data) {
  return http.put(`/prods/${id}`, data);
}
export function deleteProd(id) {
  return http.delete(`/prods/${id}`);
}
export function search(prodType, prodName, page = 0) {
  // console.log(prodType);
  return http.get(
    `/prods/search?prodType=${prodType}&prodName=${prodName}&page=${page}`
  );
}

const service = {
  createProd,
  getAllProds,
  getOneProd,
  updateProd,
  deleteProd,
  getProdsAccorToGender,
  getpage,
  search,
};
export default service;
