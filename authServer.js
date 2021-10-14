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

const redisLogger = function (req, res, next) {
  console.log(JSON.stringify(refreshTokens, null, 2));
  next();
};

authServer.use(redisLogger);

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

authServer.delete("/logout", (req, res) => {
  const { refreshToken } = req.body;
  const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
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

authServer.delete("/logOutOfAllDevices", (req, res) => {
  const { refreshToken } = req.body;
  const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  if (refreshTokens[userId]) {
    delete refreshTokens[userId];
  }
  res.status(200).json({
    status: "success",
  });
});

authServer.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  const { userId } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (refreshTokens[userId] && refreshTokens[userId].includes(refreshToken)) {
    const accessToken = getAccessToken(userData);
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
