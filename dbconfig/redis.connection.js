const redis = require("redis");
let _client;
module.exports.connectRedis = async (callback) => {
  try {
    _client = redis.createClient(
      process.env.REDIS_PORT,
      process.env.REDIS_HOST
    );
    _client.auth(process.env.REDIS_PASSWORD);
    _client.on("connect", function (err, res) {
      if (err) console.log("&&");
      else console.log("Yay! Redis is wired now!");
    });
  } catch (err) {
    throw err;
  }
};

module.exports.getRedis = () => _client;
