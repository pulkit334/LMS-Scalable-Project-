// Reddis/limiter-client.js
import Redis from "ioredis";

const limiterRedis = new Redis();

limiterRedis.on("connect", () => console.log(" Limiter Redis connected"));
limiterRedis.on("error", (err) => console.error(" Limiter Redis error:", err.message));

export default limiterRedis;