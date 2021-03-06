const express = require("express");
const router = express.Router();
const {
  signUp,
  logIn,
  logOut,
  logOutOfAllDevices,
  refreshAccessToken,
} = require("./controller");

router.route("/login").post(async (req, res) => {
  try {
    const { data, err } = await logIn(req.body);
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

router.route("/signup").post(async (req, res) => {
  try {
    const { data, err } = await signUp(req.body);
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

router.route("/logout").delete((req, res) => {
  try {
    const { data, err } = logOut(req.body.refreshToken);
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

router.route("/logout/all").delete((req, res) => {
  try {
    const { result: data, err } = logOutOfAllDevices(req.body.refreshToken);
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

router.route("/refresh/accesstoken").post((req, res) => {
  try {
    const { result: data, err } = refreshAccessToken(req.body.refreshToken);
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
