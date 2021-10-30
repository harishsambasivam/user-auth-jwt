const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

module.exports.getAccessToken = (refreshToken) => {
  const { data: userData, err } = this.verifyToken(refreshToken);
  return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, {
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

module.exports.verifyToken = (token, type) => {
  let data,
    err = null;
  try {
    const secret =
      type == "accessToken"
        ? process.env.ACCESS_TOKEN_SECRET
        : process.env.REFRESH_TOKEN_SECRET;
    data = jwt.verify(token, secret);
  } catch (e) {
    if (e) err = e;
  }
  return { data, err };
};

module.exports.getTimeDiffInMinutes = (epoch1, epoch2) => {
  var startTime = new Date(epoch1);
  var endTime = new Date(epoch2);
  var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
  var resultInMinutes = Math.round(difference / 60000);
  return resultInMinutes;
};
