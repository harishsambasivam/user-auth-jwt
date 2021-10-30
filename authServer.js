async function init() {
  const express = require("express");
  const authServer = express();
  require("dotenv").config({ path: "./src/config/.env" });

  const { connectRedis } = require("./src/db/redis");
  const { connectMongoDB } = require("./src/db/mongo");

  authServer.use(express.json());

  authServer.listen(process.env.AUTH_SERVER_PORT, () => {
    console.log(`Server running on PORT ${process.env.AUTH_SERVER_PORT}`);
  });

  try {
    await connectRedis();
    await connectMongoDB();
  } catch (e) {
    console.log("unable to connect to db's");
    console.error(e);
  }

  const userRouter = require("./src/components/user/router");

  authServer.get("/", async (req, res) => {
    res.send("server is up and running...");
  });

  authServer.use("/", userRouter);
}

init();
