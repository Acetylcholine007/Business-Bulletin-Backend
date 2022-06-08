const express = require("express");
const { body } = require("express-validator/check");
const businessController = require("../controllers/businessController");
const userAuthMW = require("../middlewares/userAuthMW");
const adminControlMW = require("../middlewares/adminControlMW");

const router = express.Router();

router.get("/", businessController.getBusinesses);

router.get("/:businessId", businessController.getBusiness);

router.post(
  "/",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Business name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business description required"),
    body("address")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business address required"),
    body("contactNo")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business contact no. required"),
  ],
  businessController.postBusiness
);

router.patch(
  "/verifyBusiness:businessId",
  userAuthMW,
  adminControlMW,
  [body("isVerified").not().isEmpty().withMessage("Status required")],
  businessController.verifyBusiness
);

router.patch(
  "/allowBusiness:businessId",
  userAuthMW,
  adminControlMW,
  [body("status").not().isEmpty().withMessage("Status required")],
  businessController.allowBusiness
);

router.patch(
  "/:businessId",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Business name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business description required"),
    body("address")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business address required"),
    body("contactNo")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business contact no. required"),
  ],
  businessController.patchBusiness
);

router.delete("/:businessId", userAuthMW, businessController.deleteBusiness);

module.exports = router;
