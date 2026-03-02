import SlidingWindowRateLimiter from "./rate-limiter.js";
import redis from "../Reddis/limiter-client.js";

// Auth — brute force protection
const authLimiter = new SlidingWindowRateLimiter({
  max: 20,
  windowMs: 60 * 1000,
  redis,
}).middleware();

// Firebase — frequent syncs
const firebaseLimiter = new SlidingWindowRateLimiter({
  max: 200,
  windowMs: 60 * 1000,
  redis,
}).middleware();

// Admin — bulk operations
const adminLimiter = new SlidingWindowRateLimiter({
  max: 100,
  windowMs: 60 * 1000,
  redis,
}).middleware();

// Webhook — event based
const webhookLimiter = new SlidingWindowRateLimiter({
  max: 40,
  windowMs: 60 * 1000,
  redis,
}).middleware();

// AI — costs money, restrict hard 
const aiLimiter = new SlidingWindowRateLimiter({
  max: 20,
  windowMs: 60 * 1000,
  redis,
}).middleware();

// Live Class — polling + signals
const liveLimiter = new SlidingWindowRateLimiter({
  max: 50,
  windowMs: 60 * 1000,
  redis,
}).middleware();

export { authLimiter, firebaseLimiter, adminLimiter, webhookLimiter, aiLimiter, liveLimiter };