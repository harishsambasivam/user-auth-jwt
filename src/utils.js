const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.getAccessToken = (userdata) => {
  return jwt.sign(userdata, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports.getRefreshToken = (userdata) => {
  return jwt.sign(userdata, process.env.REFRESH_TOKEN_SECRET);
};

module.exports.hashPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
};
