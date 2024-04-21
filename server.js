/* eslint-disable import/no-extraneous-dependencies */
const mysql = require("mysql2");
const dotenv = require("dotenv");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION: SHUTING DOWN .. ");
  process.exit(1);
});
dotenv.config({ path: "./config.env" });

exports.connection = mysql
  .createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DB,
  })
  .promise();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App runnig on port ${port}... `);
});
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: SHUTING DOWN .. ");
  server.close(() => {
    process.exit(1);
  });
});
