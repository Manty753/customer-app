const express = require("express");
const servicesController = require("../controllers/servicesController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    servicesController.createOne
  )
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    servicesController.getServices
  );
router.route("/get-my-services/:id").get(servicesController.getMyServices);

module.exports = router;
