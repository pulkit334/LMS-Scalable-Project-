import Redis from "ioredis";

const limiterRedis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing from environment variables");
}
limiterRedis.on("connect", () => console.log(" Limiter Redis connected"));
limiterRedis.on("error", (err) => console.error("Limiter Redis error:", err.message));

export default limiterRedis;