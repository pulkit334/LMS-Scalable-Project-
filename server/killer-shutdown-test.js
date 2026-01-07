import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 50 },
    { duration: "20s", target: 200 },
    { duration: "20s", target: 500 },
    { duration: "15s", target: 1000 },
    { duration: "10s", target: 0 },
  ],
};

const BASE_URL = "http://localhost:4000/api/v1";

const studentHeaders = {
  headers: {
    Authorization: `Bearer ${__ENV.STUDENT_TOKEN}`,
  },
};

const instructorHeaders = {
  headers: {
    Authorization: `Bearer ${__ENV.INSTRUCTOR_TOKEN}`,
  },
};

export default function () {
  // profile
  http.get(`${BASE_URL}/profile/me`, studentHeaders);
  http.get(`${BASE_URL}/profile/me`, instructorHeaders);

  // instructor routes
  http.get(`${BASE_URL}/courses`, instructorHeaders);
  http.get(`${BASE_URL}/category/all`, instructorHeaders);

  // student routes
  http.get(`${BASE_URL}/enrolled-courses`, studentHeaders);

  // rating routes (auth-protected)
  http.get(
    `${BASE_URL}/courses/695e6207a888925f7b578375/avg-rating`,
    studentHeaders
  );
  http.get(
    `${BASE_URL}/courses/695e8cc97ef2a7c0bbf7f696/reviews`,
    studentHeaders
  );

  sleep(0.2);
}
