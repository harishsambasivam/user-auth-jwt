const redis = require("redis");

module.exports = () => {
  const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_HOST
  );
  client.auth(process.env.REDIS_PASSWORD);
  client.on("connect", function (err, res) {
    if (err) console.error("Ouch! Unable to connect to redis");
    else console.log("Yay! Redis is wired now!");
  });

  return client;
};
