const express = require("express");
const { body } = require("express-validator/check");
const serviceController = require("../controllers/serviceController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", serviceController.getServices);

router.get("/:serviceId", serviceController.getService);

router.post(
  "/",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Service name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Service description required"),
    body("price").trim().not().isEmpty().withMessage("Service price required"),
    body("businessId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business ID required"),
  ],
  serviceController.postProduct
);

router.patch(
  "/:serviceId",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Service name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Service description required"),
    body("price").trim().not().isEmpty().withMessage("Service price required"),
    body("businessId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business ID required"),
  ],
  serviceController.patchProduct
);

router.delete("/:serviceId", userAuthMW, serviceController.deleteService);

module.exports = router;
