export default class SlidingWindowRateLimiter {
  constructor({ max, windowMs, redis }) {
    this.max = max;
    this.windowMs = windowMs;
    this.redis = redis;
  }

  middleware() {
    return async (req, res, next) => {
      try {
        const key = `ratelimit:${req.user?.id || req.ip}`;
        const now = Date.now();
        const windowStart = now - this.windowMs;

        const pipeline = this.redis.pipeline();
        pipeline.zremrangebyscore(key, 0, windowStart);
        pipeline.zadd(key, now, `${now}`);
        pipeline.zcard(key);
        pipeline.expire(key, Math.ceil(this.windowMs / 1000));
        const results = await pipeline.exec();

        const count = results[2][1];

        if (count > this.max) {
          const retryAfter = Math.ceil(this.windowMs / 1000);
          res.setHeader("Retry-After", retryAfter);
          return res.status(429).json({
            success: false,
            error: "Too Many Requests",
            message: `Too many attempts. Please try again after ${retryAfter} seconds.`,
            remaining: 0,
            retryAfter,
          });
        }

        res.setHeader("X-RateLimit-Limit", this.max);
        res.setHeader("X-RateLimit-Remaining", this.max - count);
        next();
      } catch (err) {
        console.error("RateLimiter error:", err);
        next();
      }
    };
  }
}
