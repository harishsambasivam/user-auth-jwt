const express = require("express");
const app = express();
const chalk = require("chalk");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const User = require("./models/user");

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

// This middleware will check if user's cookie is still saved in browser and if user cookie is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie("user_sid");
  }
  next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  console.log(req.session);
  console.log(req.cookies);
  if (req.session.user && req.cookies.user_sid) {
    res.send("Dashboard");
  } else {
    next();
  }
};

// route for Home-Page
app.get("/", sessionChecker, (req, res) => {
  res.send("login");
});

// route for user signup
app
  .route("/signup")
  .get(sessionChecker, (req, res) => {
    res.send("signup");
  })
  .post((req, res) => {
    console.log(req.body);
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => {
        req.session.user = user.dataValues;
        res.send("dashboard");
      })
      .catch((error) => {
        res.send(error);
      });
  });

// route for user Login
app
  .route("/login")
  .get(sessionChecker, (req, res) => {
    res.send("login");
  })
  .post((req, res) => {
    var username = req.body.username,
      password = req.body.password;

    User.findOne({ where: { username: username } }).then(function (user) {
      if (!user) {
        res.send("login");
      } else if (!user.validPassword(password)) {
        res.send("login");
      } else {
        req.session.user = user.dataValues;
        res.send("dashboard");
      }
    });
  });

// route for user logout
app.get("/logout", (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
    res.clearCookie("user_sid");
    res.send("/");
  } else {
    res.send("/login");
  }
});

// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("404 Never Found");
});

app.listen(process.env.PORT, () => {
  console.log(
    chalk.bgWhite.black("Server spinning on ") +
      chalk.magenta.bgWhite.bold(process.env.PORT)
  );
});
