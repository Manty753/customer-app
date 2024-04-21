const catchAsync = require("../utils/catchAsync");
const db = require("../server");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");

exports.createOne = catchAsync(async function (req, res, next) {
  if (req.body.password === req.body.passwordConfirm) {
    password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordConfirm = null;
  } else {
    return next(new AppError("This route is not for pass update", 400));
  }

  const doc = await db.connection.query(
    `INSERT INTO users(company_id, role, name, user_name, password, password_confirm) VALUES (?,?,?,?,?,?)`,
    [
      req.body.company_id,
      req.body.role,
      req.body.name,
      req.body.user_name,
      password,
      req.body.passwordConfirm,
    ]
  );
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.createOneAdmin = catchAsync(async function (req, res, next) {
  if (req.body.password === req.body.passwordConfirm) {
    password = await bcrypt.hash(req.body.password, 12);
    req.body.passwordConfirm = null;
  } else {
    return next(new AppError("This route is not for pass update", 400));
  }
  const doc = await db.connection.query(
    `INSERT INTO admins(name, role, user_name, password, password_confirm) VALUES (?,?,?,?,?)`,
    [
      req.body.name,
      req.body.role,
      req.body.user_name,
      password,
      req.body.passwordConfirm,
    ]
  );
  res.status(201).json({
    status: "success",
    data: doc,
  });
});
