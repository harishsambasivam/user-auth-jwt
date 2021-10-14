const express = require("express");
const authServer = express();
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const { getAccessToken, getRefreshToken } = require("./utils");
const connectRedis = require("./redis");
const redis = connectRedis();

authServer.use(express.json());

authServer.listen(process.env.AUTH_SERVER_PORT, () => {
  console.log(`Server running on PORT ${process.env.AUTH_SERVER_PORT}`);
});

authServer.get("/", (req, res) => {
  res.send("server is up and running...");
});

authServer.post("/login", (req, res) => {
  let { userData } = req.body;
  const { userId } = userData;

  // validate user creds in db
  const userExists = true;
  if (userExists) {
    const refreshToken = getRefreshToken(userData);
    const accessToken = getAccessToken(userData);

    redis.SADD(userId, refreshToken);

    res.status(200).json({
      message: { refreshToken, accessToken, expiresIn: "1h" },
      status: "success",
    });
  } else {
    res.status(401).json({
      message: "",
      status: "error",
    });
  }
});

authServer.delete("/logout", (req, res) => {
  const { refreshToken } = req.body;
  const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  redis.SISMEMBER(userId, refreshToken, (err, result) => {
    if (result === 1) {
      redis.SREM(userId, refreshToken);
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(200).json({
        status: "You're already logged out",
      });
    }
  });
});

authServer.delete("/logOutOfAllDevices", (req, res) => {
  const { refreshToken } = req.body;
  const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  redis.SISMEMBER(userId, refreshToken, (err, result) => {
    if (result === 1) {
      redis.DEL(userId);
      res.status(200).json({
        status: "success",
      });
    } else {
      res.status(401).json({
        message: "unauthorized access",
        status: "error",
      });
    }
  });
});

authServer.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const { userId, userName } = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  redis.SISMEMBER(userId, refreshToken, (err, result) => {
    if (result === 1) {
      const accessToken = getAccessToken({ userId, userName });
      res.status(200).json({
        status: "success",
        message: {
          accessToken,
          expiresIn: "1h",
        },
      });
    } else {
      res.status(401).json({
        message: "unauthorized access",
        status: "error",
      });
    }
  });
});
