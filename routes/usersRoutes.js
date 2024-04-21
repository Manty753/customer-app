const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post("/login", authController.login);
router.post("/login-admin", authController.loginAdmin);
router.route("/admins").post(usersController.createOneAdmin);
router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    usersController.createOne
  );

module.exports = router;
