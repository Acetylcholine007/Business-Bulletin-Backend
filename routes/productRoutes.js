const express = require("express");
const { body } = require("express-validator/check");

const buoyController = require("../controllers/buoyController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();
const Buoy = require("../models/Buoy");

router.get("/", buoyController.getBuoys);

router.get("/:buoyId", userAuthMW, buoyController.getBuoy);

router.post(
  "/",
  userAuthMW,
  [
    body("serialKey")
      .trim()
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value.length !== 11) {
          return Promise.reject("Serial key should be 11 character String");
        }
        return Buoy.findOne({ serialKey: value }).then((buoyDoc) => {
          if (buoyDoc) {
            return Promise.reject("Buoy with the same serial already exist");
          }
        });
      }),
    body("alertThreshold").not().isEmpty().withMessage("Enter Alert Threshold"),
    body("alarmThreshold").not().isEmpty().withMessage("Enter Alarm Threshold"),
    body("criticalThreshold")
      .not()
      .isEmpty()
      .withMessage("Enter Critical Threshold"),
  ],
  buoyController.postBuoy
);

router.patch(
  "/:buoyId",
  [
    body("alertThreshold").not().isEmpty().withMessage("Enter Alert Threshold"),
    body("alarmThreshold").not().isEmpty().withMessage("Enter Alarm Threshold"),
    body("criticalThreshold")
      .not()
      .isEmpty()
      .withMessage("Enter Critical Threshold"),
  ],
  userAuthMW,
  buoyController.patchBuoy
);

router.delete("/:buoyId", userAuthMW, buoyController.deleteBuoy);

module.exports = router;
