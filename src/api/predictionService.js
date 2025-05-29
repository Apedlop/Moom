import http from "./http-common";

class PredictionService {
  addPrediction(data) {
    return http.post("/predictions", data);
  }

  updatePrediction(id, data) {
    return http.put(`/predictions/${id}`, data);
  }

  deletePrediction(id) {
    return http.delete(`/predictions/${id}`);
  }

  getPredictionById(id) {
    return http.get(`/predictions/${id}`);
  }

  getAllPredictions() {
    return http.get("/predictions/all");
  }

  getPredictionByDate(date) {
    return http.get("/predictions/date", { params: { date } });
  }

  getPredictionBetweenDate(from, to) {
    return http.get("/predictions/range", { params: { from, to } });
  }

  predictNextCycle(userId) {
    return http.get(`/predictions/predict/${userId}`);
  }
}

export default new PredictionService();
