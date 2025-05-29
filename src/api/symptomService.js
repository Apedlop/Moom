import http from "./http-common";

class SymptomService {
  addSymptom(data) {
    return http.post("/symptoms", data);
  }

  updateSymptom(id, data) {
    return http.put(`/symptoms/${id}`, data);
  }

  deleteSymptom(id) {
    return http.delete(`/symptoms/${id}`);
  }

  getSymptomById(id) {
    return http.get(`/symptoms/${id}`);
  }

  getAllSymptoms() {
    return http.get("/symptoms/all");
  }

  getSymptomsByUserId(userId) {
    return http.get(`/symptoms/user/${userId}`);
  }

  getSymptomsByUserIdAndDate(userId, date) {
    return http.get(`/symptoms/user/${userId}/date`, {
      params: { date }
    });
  }

  getSymptomsBetweenDates(userId, from, to) {
    return http.get(`/symptoms/user/${userId}/range`, {
      params: { from, to }
    });
  }
}

export default new SymptomService();
