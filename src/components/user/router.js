const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  logOut,
  logOutOfAllDevices,
  refreshAccessToken,
} = require("./controller");

router.route("/login").post((req, res) => {
  try {
    const { result: data, err } = logIn(req.body);
    if (err) throw err;
    return res.status(200).send({
      message: data,
      status: "success",
    });
  } catch (err) {
    const { message, code } = err;
    return res.status(500).send({
      message,
      code,
      status: "error",
    });
  }
});

router.route("/signup").post((req, res) => {
  try {
    const { result: data, err } = signUp(req.body);
    if (err) throw err;
    return res.status(200).send({
      message: data,
      status: "success",
    });
  } catch (err) {
    const { message, code } = err;
    return res.status(500).send({
      message,
      code,
      status: "error",
    });
  }
});

router.route("/logout", (req, res) => {
  try {
    const { result: data, err } = logOut(req.body);
    if (err) throw err;
    return res.status(200).send({
      message: data,
      status: "success",
    });
  } catch (err) {
    const { message, code } = err;
    return res.status(500).send({
      message,
      code,
      status: "error",
    });
  }
});

router.route("/logout/all", (req, res) => {
  try {
    const { result: data, err } = logOutOfAllDevices(req.body);
    if (err) throw err;
    return res.status(200).send({
      message: data,
      status: "success",
    });
  } catch (err) {
    const { message, code } = err;
    return res.status(500).send({
      message,
      code,
      status: "error",
    });
  }
});

router.route("/refresh/accesstoken", (req, res) => {
  try {
    const { result: data, err } = refreshAccessToken(req.body);
    if (err) throw err;
    return res.status(200).send({
      message: data,
      status: "success",
    });
  } catch (err) {
    const { message, code } = err;
    return res.status(500).send({
      message,
      code,
      status: "error",
    });
  }
});

module.exports = router;
