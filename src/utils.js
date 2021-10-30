const jwt = require("jsonwebtoken");

module.exports.getAccessToken = (userdata) => {
  return jwt.sign(userdata, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

module.exports.getRefreshToken = (userdata) => {
  return jwt.sign(userdata, process.env.REFRESH_TOKEN_SECRET);
};
