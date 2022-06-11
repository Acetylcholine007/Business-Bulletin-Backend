const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/User");
const authController = require("../controllers/authController");
const userVerificationMW = require("../middlewares/userVerificationMW");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          return Promise.reject("Email address already exists");
        }
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum Password length: 5"),
    body("firstname").trim().not().isEmpty().withMessage("First Name required"),
    body("lastname").trim().not().isEmpty().withMessage("Last Name required"),
    body("contactNo")
      .trim()
      .not()
      .isEmpty()
      .withMessage("contact No. required"),
    body("address").trim().not().isEmpty().withMessage("Address required"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .trim()
      .not()
      .isEmpty()
      .withMessage("Email required"),
    body("password").trim().not().isEmpty().withMessage("Password required"),
  ],
  authController.login
);

router.get(
  "/verify/:verificationToken",
  userVerificationMW,
  authController.verifyUser
);

router.get("/resetPasswordForm/:uid", authController.resetPasswordForm);

router.post("/resetPassword/:uid", authController.resetPassword);

router.post(
  "/sendResetPassword",
  [body("email").isEmail().trim().not().isEmpty()],
  authController.sendResetPassword
);

router.post(
  "/sendVerification",
  [body("email").isEmail().trim().not().isEmpty()],
  authController.sendVerification
);

module.exports = router;
