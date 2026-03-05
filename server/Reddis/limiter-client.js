import Redis from "ioredis";

const limiterRedis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

limiterRedis.on("connect", () => console.log(" Limiter Redis connected"));
limiterRedis.on("error", (err) => console.error("Limiter Redis error:", err.message));

export default limiterRedis;