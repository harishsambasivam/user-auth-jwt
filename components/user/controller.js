const jwt = require("jsonwebtoken");
const {
  getAccessToken,
  getRefreshToken,
  hashPassword,
} = require("../utils/utils");
const { getRedis } = require("../../dbconfig/redis.connection");
const { getMongoDB } = require("../../dbconfig/mongodb.connection");
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
  let data,
    err = null;
  try {
    const { email } = userData;

    const user = await mongodb.collection("test").find({ email }).toArray();

    // validate user creds in db
    if (user.length) {
      const { password, ...userData } = user[0];
      userData["userId"] = userData._id.toString();
      const refreshToken = getRefreshToken(userData);
      const accessToken = getAccessToken(refreshToken);

      redis.SADD(userData["userId"], refreshToken);
      data = { refreshToken, accessToken, expiresIn: "1h" };
    } else {
      throw {
        message: "please check your username or password",
      };
    }
  } catch (e) {
    if (e) err = e;
  }
  return { data, err };
};

// logout
module.exports.logOut = (refreshToken) => {
  let data,
    err = null;
  try {
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    redis.SISMEMBER(userId, refreshToken, (err, result) => {
      if (result === 1) {
        console.log(result);
        redis.SREM(userId, refreshToken);
        data = "success";
      } else {
        throw {
          message: "You're already logged out",
        };
      }
    });
  } catch (e) {
    if (e) err = e;
  }
  return { data, err };
};

// logout of all devices
module.exports.logOutOfAllDevices = (refreshToken) => {
  let data,
    err = null;
  try {
    const { userId } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    redis.SISMEMBER(userId, refreshToken, (err, result) => {
      if (result === 1) {
        console.log(result);
        redis.DEL(userId);
        data = "success";
      } else {
        throw {
          message: "You're already logged out",
        };
      }
    });
  } catch (e) {
    if (e) err = e;
  }

  return { data, err };
};

// refresh the access token using refresh token
module.exports.refreshAccessToken = (refreshToken) => {
  let data,
    err = null;
  console.log(refreshToken);
  try {
    const { userId, userName } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    redis.SISMEMBER(userId, refreshToken, (err, result) => {
      console.log(result);
      if (result === 1) {
        const accessToken = getAccessToken({ userId, userName });
        data = accessToken;
      } else {
        throw {
          message: "refresh token expired",
        };
      }
    });
  } catch (e) {
    if (e) err = e;
  }
  return { data, err };
};
