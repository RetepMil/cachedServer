require("dotenv").config();

const redis = require("redis");

class RedisClient {
  static client;

  constructor() {}

  static initialize() {
    this.client = redis.createClient(process.env.REDIS_PORT);
    this.client.connect();
  }

  static getClient() {
    if (!this.client) this.initialize();
    return this.client;
  }
}

module.exports = RedisClient.getClient();
