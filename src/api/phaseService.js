import http from "./http-common";

class PhaseService {
  addPhase(data) {
    return http.post("/phases", data);
  }

  updatePhase(id, data) {
    return http.put(`/phases/${id}`, data);
  }

  deletePhase(id) {
    return http.delete(`/phases/${id}`);
  }

  getPhaseById(id) {
    return http.get(`/phases/${id}`);
  }

  getAllPhases() {
    return http.get("/phases/all");
  }

  getPhaseByDateRange(start, end) {
    return http.get("/phases/range", { params: { start, end } });
  }

  getPhaseByCycle(phaseCycle) {
    return http.get("/phases/cycle", { params: { phaseCycle } });
  }

  generatePhases(idUser, startDate, cycleLength, menstruationLength) {
    return http.get("/phases/generatePhases/", {
      params: {
        idUser,
        startDate,
        cycleLength,
        menstruationLength,
      }
    });
  }
}

export default new PhaseService();
