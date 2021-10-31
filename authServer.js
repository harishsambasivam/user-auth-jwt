async function init() {
  const express = require("express");
  const authServer = express();
  require("dotenv").config();

  const { connectRedis } = require("./dbconfig/redis.connection");
  const { connectMongoDB } = require("./dbconfig/mongodb.connection");

  authServer.use(express.json());

  authServer.listen(process.env.AUTH_SERVER_PORT, () => {
    console.log(`Server running on PORT ${process.env.AUTH_SERVER_PORT}`);
  });

  try {
    await connectRedis();
    await connectMongoDB();
  } catch (e) {
    console.log("unable to connect to db's");
  }

  const userRouter = require("./components/user/router");

  authServer.get("/", async (req, res) => {
    res.send("server is up and running...");
  });

  authServer.use("/", userRouter);
}

init();
