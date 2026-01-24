import redisClient from "../../Reddis/client.js";

export const cacheMiddleware = (keyBuilder, ttl = 1000) => {
  return async (req, res, next) => {
    try {
      const key = keyBuilder(req);

      const cached = await redisClient.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        await redisClient.setex(key, ttl, JSON.stringify(data));
        return originalJson(data);
      };

      return next();
    } catch (err) {
      return next();
    }
  };
};
