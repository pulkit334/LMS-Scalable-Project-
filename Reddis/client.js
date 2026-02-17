const Redis = require('ioredis');
require('dotenv').config();

const client = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

client.on('connect', () => console.log(' Redis Connected'));
client.on('error', (err) => console.error('Redis Error:', err));

module.exports = client;
