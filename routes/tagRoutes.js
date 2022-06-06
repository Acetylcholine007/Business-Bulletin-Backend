const express = require("express");
const { body } = require("express-validator/check");
const tagController = require("../controllers/tagController");
const userAuthMW = require("../middlewares/userAuthMW");
const adminControlMW = require("../middlewares/adminControlMW");

const router = express.Router();

router.get("/", tagController.getTags);

router.get("/:tagId", tagController.getTag);

router.post(
  "/",
  userAuthMW,
  adminControlMW,
  [body("name").trim().not().isEmpty().withMessage("Tag name required")],
  tagController.postTag
);

router.patch(
  "/:tagId",
  userAuthMW,
  adminControlMW,
  [body("name").trim().not().isEmpty().withMessage("Tag name required")],
  tagController.patchTag
);

router.delete("/:tagId", userAuthMW, adminControlMW, tagController.deleteTag);

module.exports = router;
