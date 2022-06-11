const express = require("express");
const { body } = require("express-validator/check");
const userController = require("../controllers/userController");
const userAuthMW = require("../middlewares/userAuthMW");
const adminControlMW = require("../middlewares/adminControlMW");

const router = express.Router();

router.get("/", userAuthMW, adminControlMW, userController.getUsers);

router.get("/:userId", userAuthMW, userController.getUser);

router.patch(
  "/changePassword/:userId",
  userAuthMW,
  [
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum Password length: 5"),
  ],
  userController.changePassword
);

router.patch(
  "/allowUser/:userId",
  userAuthMW,
  adminControlMW,
  [body("status").not().isEmpty().withMessage("Status required")],
  userController.allowUser
);

router.patch(
  "/:userId",
  userAuthMW,
  [
    body("firstname").trim().not().isEmpty().withMessage("First Name required"),
    body("lastname").trim().not().isEmpty().withMessage("Last Name required"),
    body("contactNo")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Contact No. required"),
    body("address").trim().not().isEmpty().withMessage("Address required"),
  ],
  userController.patchUser
);

router.delete("/:userId", userAuthMW, userController.deleteUser);

module.exports = router;
