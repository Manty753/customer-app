const catchAsync = require("../utils/catchAsync");
const db = require("../server");

exports.createOne = catchAsync(async function (req, res, next) {
  const doc = await db.connection.query(
    `INSERT INTO services(company_id, user_id, name) VALUES (?,?,?)`,
    [req.body.company_id, req.body.user_id, req.body.name]
  );
  res.status(201).json({
    status: "success",
    data: doc,
  });
});
exports.getMyServices = catchAsync(async function (req, res, next) {
  const [doc] = await db.connection.query(
    `SELECT * FROM services WHERE user_id= ?`,
    [req.params.id]
  );
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.getServices = catchAsync(async function (req, res, next) {
  const [doc] = await db.connection.query(`SELECT * FROM services `);
  res.status(201).json({
    status: "success",
    data: doc,
  });
});
