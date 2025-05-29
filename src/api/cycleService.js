import http from "./http-common";

class CycleService {
  addCycle(data) {
    return http.post("/cycles", data);
  }

  updateCycle(id, data) {
    return http.put(`/cycles/${id}`, data);
  }

  deleteCycle(id) {
    return http.delete(`/cycles/${id}`);
  }

  getCycleById(id) {
    return http.get(`/cycles/${id}`);
  }

  getCyclesByUserId(userId) {
    return http.get(`/cycles/user/${userId}`);
  }

  getAllCycles() {
    return http.get("/cycles/all");
  }

  getLastCycleByUserId(userId) {
    return http.get(`/cycles/user/${userId}/last`);
  }

  calculateNextPeriodDate(userId) {
    return http.get(`/cycles/user/${userId}/next-period`);
  }

  calculateAverageCycleLength(userId) {
    return http.get(`/cycles/user/${userId}/average-length`);
  }

  existsCycleOnDate(userId, date) {
    return http.get(`/cycles/user/${userId}/exists-on-date`, { params: { date } });
  }

  getCyclesBetweenDates(userId, from, to) {
    return http.get(`/cycles/user/${userId}/between`, { params: { from, to } });
  }

  getMenstruationDuration(id) {
    return http.get(`/cycles/${id}/menstruationDuration`);
  }
}

export default new CycleService();
