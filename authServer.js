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

authServer.post("/signin", (req, res) => {
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
