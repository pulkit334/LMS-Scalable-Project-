
const Redis = require("ioredis");
const client = new Redis(); // defaults to 127.0.0.1:6379
client.on("error",(err)=>console.log("Reddis Error",err));
module.exports = client;
