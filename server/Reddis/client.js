
// const Redis = require("ioredis");
// const client = new Redis(); // defaults to 127.0.0.1:6379
// client.on("error",(err)=>console.log("Reddis Error",err));
// module.exports = client;
const Redis = require("ioredis");

const client = new Redis(process.env.REDIS_URL);
console.log("Redis URL:", process.env.REDIS_URL);

client.on("error", (err) =>
  console.log("Redis Error:", err.message)
);

module.exports = client;
