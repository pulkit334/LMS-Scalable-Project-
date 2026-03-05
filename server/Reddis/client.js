const Redis = require("ioredis");
require("dotenv").config();
const client = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

client.on("connect", () => console.log(" Redis connected"));
client.on("error", (err) => console.log("Redis Error", err));

module.exports = client;