import http from "./http-common";

class EnumService {
  getTypePain() {
    return http.get("/enums/typePain");
  }

  getTypeEmotion() {
    return http.get("/enums/typeEmotion");
  }

  getTypePeriod() {
    return http.get("/enums/typePeriod");
  }
}

export default new EnumService();