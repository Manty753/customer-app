const catchAsync = require("../utils/catchAsync");
const db = require("../server");

exports.createOne = catchAsync(async function (req, res, next) {
  const doc = await db.connection.query(
    `INSERT INTO customer(company_name, industry) VALUES (?,?)`,
    [req.body.company, req.body.industry]
  );
  res.status(201).json({
    status: "success",
    data: doc,
  });
});
