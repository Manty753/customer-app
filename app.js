const express = require("express");
const cookieParser = require("cookie-parser");
const companyRouter = require("./routes/companyRoutes");
const servicesRouter = require("./routes/servicesRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();

app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/companies", companyRouter);
app.use("/api/v1/services", servicesRouter);
module.exports = app;
