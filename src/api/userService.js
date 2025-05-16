import http from "./http-common";

class UserService {
  addUser(data) {
    return http.post("/user", data);
  }

  updateUser(id, data) {
    return http.put(`/user/${id}`, data);
  }

  deleteUser(id) {
    return http.delete(`/user/${id}`);
  }

  getUser(id) {
    return http.get(`/user/${id}`);
  }

  getAll() {
    return http.get("/user/all");
  }

  emailExists(email) {
    return http.get(`/user/exists`, email);
  }
}

export default new UserService();