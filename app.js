require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const { nanoid } = require("nanoid");
const session = require("express-session");

const User = require("./models/user");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    key: "sid",
    secret: "work hard",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 7 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.cookies.sid && !req.session.user) {
    res.clearCookie("sid");
  }
  next();
});

const sessionChecker = async (req, res, next) => {
  if (req.originalUrl === "/thank-you") {
    return next();
  }

  if (!req.session.user || !req.cookies.sid) {
    const user = await User.create({
      userId: nanoid(),
    });
    req.session.user = user;
  } else {
    const user = await User.findOne({ userId: req.session.user.userId });
    req.session.user = user;
  }
  next();
};

app.use(sessionChecker);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
