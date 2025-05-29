import axios from 'axios';

const service = axios.create({
  baseURL: "http://192.168.1.21:8090/api",
  headers: {
    "Content-type": "application/json",
  },
});

export default service;