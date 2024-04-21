const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const db = require("../server");
const bcrypt = require("bcrypt");
const { log } = require("console");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSandToken = async (user, role, statusCode, req, res) => {
  const token = signToken(user);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  if (role === "user") {
    let [data] = await db.connection.query(
      `SELECT * FROM users WHERE user_name = ?`,
      [user]
    );
    res.status(statusCode).json({
      status: "success",
      token,
      data: data[0],
    });
  } else {
    let [data] = await db.connection.query(
      `SELECT * FROM admins WHERE user_name = ?`,
      [user]
    );
    res.status(statusCode).json({
      status: "success",
      token,
      data: data[0],
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  const { password, user_name } = req.body;

  //* 1) check if email and pass exist
  if (!password || !user_name) {
    return next(new AppError("please provide username and password", 400));
  }

  //*2) check if user && password is correct
  const [user_password] = await db.connection.query(
    `SELECT password FROM users WHERE user_name = ?`,
    [user_name]
  );

  const [user_id] = await db.connection.query(
    `SELECT id FROM users WHERE user_name = ?`,
    [user_name]
  );
  const [role] = await db.connection.query(
    `SELECT role FROM users WHERE user_name = ?`,
    [user_name]
  );
  const confirm = await bcrypt.compare(password, user_password[0].password);
  if (!confirm) {
    return next(new AppError("Incorrect username or password", 401));
  }
  //*3) if ok send token to client
  createSandToken(user_name, role[0].role, 200, req, res);
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { password, user_name } = req.body;

  //* 1) check if email and pass exist
  if (!password || !user_name) {
    return next(new AppError("please provide username and password", 400));
  }

  //*2) check if user && password is correct
  const [user_password] = await db.connection.query(
    `SELECT password FROM admins WHERE user_name = ?`,
    [user_name]
  );
  const [user_id] = await db.connection.query(
    `SELECT id FROM admins WHERE user_name = ?`,
    [user_name]
  );
  const [role] = await db.connection.query(
    `SELECT role FROM admins WHERE user_name = ?`,
    [user_name]
  );
  //* Compare hashed password
  const confirm = await bcrypt.compare(password, user_password[0].password);
  if (!confirm) {
    return next(new AppError("Incorrect username or password", 401));
  }
  //*3) if ok send token to client
  createSandToken(user_name, role[0].role, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //* 1) get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not logged in, pleas log in ", 401));
  }
  //* 2) Validate token !!!
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded.id);
  let [currentUser] = await db.connection.query(
    `SELECT * FROM users WHERE user_name = ?`,
    [decoded.id]
  );

  //* 3) Defin which role user have

  const role = currentUser[0] ? "user" : "admin";
  if ((typeof currentUser.role === "undefined") & (role === "user")) {
    req.user = currentUser[0];
    res.locals.user = currentUser[0];
  } else {
    [currentUser] = await db.connection.query(
      `SELECT * FROM admins WHERE user_name = ?`,
      [decoded.id]
    );

    req.user = currentUser[0];
    res.locals.user = currentUser[0];
  }
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is aray ["admin", "lead-guide"]. role = "user"
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission", 403));
    }
    next();
  };
