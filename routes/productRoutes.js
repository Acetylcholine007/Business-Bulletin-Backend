const express = require("express");
const { body } = require("express-validator/check");
const productController = require("../controllers/productController");
const userAuthMW = require("../middlewares/userAuthMW");

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:productId", productController.getProduct);

router.post(
  "/",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Product name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Product description required"),
    body("price").trim().not().isEmpty().withMessage("Product price required"),
    body("businessId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business ID required"),
  ],
  productController.postProduct
);

router.patch(
  "/:productId",
  userAuthMW,
  [
    body("name").trim().not().isEmpty().withMessage("Product name required"),
    body("description")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Product description required"),
    body("price").trim().not().isEmpty().withMessage("Product price required"),
    body("businessId")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Business ID required"),
  ],
  productController.patchProduct
);

router.delete("/:productId", userAuthMW, productController.deleteProduct);

module.exports = router;
