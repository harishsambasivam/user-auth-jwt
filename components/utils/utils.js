const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

module.exports.getAccessToken = (userdata) => {
  return jwt.sign(userdata, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TTL,
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

module.exports.verifyPassword = async (plainTextPassword, hashedPassword) => {
  const result = await bcrypt.compare(plainTextPassword, hashedPassword);
  return result === true;
};
