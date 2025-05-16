import axios from 'axios';

const service = axios.create({
  baseURL: "http://172.16.3.105:8090/api",
  headers: {
    "Content-type": "application/json",
  },
});

export default service;