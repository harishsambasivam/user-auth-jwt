const express = require("express");
const authServer = express();
require("dotenv").config({ path: "./config/.env" });
const jwt = require("jsonwebtoken");
const { getAccessToken, getRefreshToken } = require("./utils");

const refreshTokens = {};

authServer.use(express.json());

authServer.listen(process.env.AUTH_SERVER_PORT, () => {
  console.log(`Server running on PORT ${process.env.AUTH_SERVER_PORT}`);
});

// const redisLogger = function (req, res, next) {
//   console.log(JSON.stringify(refreshTokens, null, 2));
//   next();
// };

// authServer.use(redisLogger);

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

    if (refreshTokens[userId]) refreshTokens[userId].push(refreshToken);
    else refreshTokens[userId] = [refreshToken];

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

authServer.post("/logout", (req, res) => {
  const { userData, refreshToken } = req.body;
  const { userId } = userData;

  if (refreshTokens[userId]) {
    refreshTokens[userId] = refreshTokens[userId].filter(
      (token) => token != refreshToken
    );
    console.log(refreshTokens[userId]);
  }

  res.status(200).json({
    status: "success",
  });
});

authServer.post("signOutOfAllDevices", (req, res) => {
  const { userData } = req.body;
  const { userId } = userData;
  if (refreshTokens[userId]) {
    delete refreshTokens[userId];
  }
  res.status(200).json({
    status: "success",
  });
});
