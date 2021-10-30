const jwt = require("jsonwebtoken");
const {
  getAccessToken,
  getRefreshToken,
  hashPassword,
} = require("../../utils");
const { getRedis } = require("../../db/redis");
const { getMongoDB } = require("../../db/mongo");

const mongodb = getMongoDB();
const redis = getRedis();

// add new user
module.exports.signUp = async (userData) => {
  let data,
    err = null;
  try {
    let { username, email, password } = userData;
    password = await hashPassword(password);
    const dbResponse = await mongodb.collection("test").insertOne({
      username,
      email,
      password,
    });
    data = { userId: dbResponse?.insertedId };
  } catch (e) {
    if (e) err = e;
  }
  return { data, err };
};

// login
module.exports.logIn = async (userData) => {
  const { userId } = userData;

  const user = await mongodb
    .collection("test")
    .find({ userId: "617d12df7b82331324b6f03d" })
    .toArray();

  console.log(user);

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
};

// logout
module.exports.logOut = (req, res) => {
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
};

// logout of all devices
module.exports.logOutOfAllDevices = (req, res) => {
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
};

// refresh the access token using refresh token
module.exports.refreshAccessToken = (req, res) => {
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
};
