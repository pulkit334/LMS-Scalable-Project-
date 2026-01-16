import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

const BASE_URL = "http://localhost:5000/api/v1";

export default function () {
  const payload = JSON.stringify({
    email: "gpulkit744@gmail.com",
    password: "Pulkitgo123@#",
    accountType: "student",   //  IMPORTANT
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  check(res, {
    "Login success (200)": (r) => r.status === 200,
    "JWT token received": (r) => JSON.parse(r.body).token !== undefined,
  });
}
