const express = require("express");
const { body } = require("express-validator/check");

const reportController = require("../controllers/reportController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();
const Report = require("../models/Report");

router.get("/", userAuthMW, reportController.getReports);

router.get("/:reportId", userAuthMW, reportController.getReport);

router.post(
  "/",
  [
    body("type").trim().not().isEmpty().withMessage("Specify Report Type"),
    body("serialKey").trim().not().isEmpty().withMessage("Specify Serial Key"),
    body("heading")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Specify report heading"),
    body("body").trim().not().isEmpty().withMessage("Specify report body"),
  ],
  userAuthMW,
  reportController.postReport
);

router.patch("/:reportId", userAuthMW, reportController.patchReport);

router.delete("/:reportId", userAuthMW, reportController.deleteReport);

module.exports = router;
