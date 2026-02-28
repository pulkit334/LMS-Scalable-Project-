import ws from "k6/ws";
import { check } from "k6";
import { SharedArray } from "k6/data";
import { Trend, Counter, Gauge } from "k6/metrics";

// ── Custom Metrics ──────────────────────────────────────────
const connectLatency = new Trend("connect_latency_ms", true);
const msgLatency     = new Trend("msg_latency_ms",     true);
const totalBandwidth = new Counter("bandwidth_bytes");
const activeStudents = new Gauge("active_students");
// ────────────────────────────────────────────────────────────

const users = new SharedArray("users", function () {
  return JSON.parse(open("./test-users-slim.json"));
});

export const options = {
  // Each scenario runs ALL VUs at once in parallel
  scenarios: {
    parallel_students: {
      executor: "ramping-vus",  // ramp up VUs in parallel
      stages: [
        { duration: "30s", target: 50   },  // 50 students join together
        { duration: "1m",  target: 200  },  // 200 students join together
        { duration: "1m",  target: 500  },  // 500 students join together
        { duration: "1m",  target: 1000 },  // 1000 students join together
        { duration: "30s", target: 0    },  // all leave together
      ],
      gracefulRampDown: "10s",
    },
  },
  thresholds: {
    ws_session_duration: ["p(95)<20000"],
    ws_sessions:         ["count>0"],
    checks:              ["rate>0.90"],
    connect_latency_ms:  ["p(95)<3000"],
    msg_latency_ms:      ["p(95)<500"],
  },
};

export default function () {
  const user         = users[__VU % users.length];
  const url          = "wss://pulkit-cqzbu469.livekit.cloud/rtc?access_token=" + user.token + "&protocol=15";
  const connectStart = Date.now();

  const res = ws.connect(url, {}, function (socket) {

    socket.on("open", function () {
      const latency = Date.now() - connectStart;
      connectLatency.add(latency);
      activeStudents.add(1);
      console.log("CONNECTED: " + user.identity + " | latency=" + latency + "ms | active=" + __VU);
    });

    socket.on("message", function (data) {
      totalBandwidth.add(data.length);
      msgLatency.add(Date.now() - connectStart);
    });

    socket.on("close", function (code, reason) {
      activeStudents.add(-1);
      if (code !== 1001) {
        console.log("CLOSED: " + user.identity + " code=" + code + " reason=" + reason);
      }
    });

    socket.on("error", function (e) {
      console.log("ERROR: " + user.identity + " | " + JSON.stringify(e));
    });

    // ✅ Stay connected for the entire test duration — no reconnecting
    socket.setTimeout(function () {
      socket.close();
    }, 180000); // 3 minutes = full test duration

  });

  check(res, {
    "WebSocket connected": function (r) {
      return r && r.status === 101;
    },
  });

  // ✅ No sleep() here — VU stays alive inside the socket above
}
