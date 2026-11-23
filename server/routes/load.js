import http from "k6/http";
import { check } from "k6";
import { options } from "./load.config.js";

export { options };

const BASE_URL = "http://localhost:4000/api/v1";

export default function () {
  const payload = JSON.stringify({
    email: "gpulkit744@gmail.com",
    password: "Pulkitgo123@#",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/auth/login`, payload, params);

  check(res, {
    "login status is 200": (r) => r.status === 200,
    "token exists": (r) => JSON.parse(r.body).token !== undefined,
  });
}
