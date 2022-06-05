const { validationResult } = require("express-validator/check");
const Product = require("../models/Product");
mongoose = require("mongoose");

exports.getProducts = async (req, res, next) => {
  try {
    const perPage = 12;
    const query = req.query.query || "";
    const currentPage = req.query.page || 1;

    const totalItems = await Product.find(
      query ? { name: { $regex: query, $options: "i" } } : {}
    ).countDocuments();
    const products = await Product.find(
      query ? { name: { $regex: query, $options: "i" } } : {}
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("business");

    res.status(200).json({
      message: "Products fetched successfully.",
      products,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "business"
    );
    if (!product) {
      const error = new Error("Could not find product");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Product fetched", product });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      business: req.body.businessId,
    });

    await product.save();
    res.status(200).json({
      message: "Product added",
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const product = await Product.findById(req.params.productId);
    const product2 = await Product.findOne({
      name: req.body.name,
      business: req.body.businessId,
    });
    if (!product) {
      const error = new Error("Product does not exists");
      error.statusCode = 422;
      throw error;
    }

    if (product.name !== req.body.name && product2) {
      const error = new Error("Product name already exists");
      error.statusCode = 422;
      throw error;
    }

    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;

    await product.save();
    res.status(200).json({
      message: "Product updated",
      product,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    if (req.params.productId === undefined) {
      const error = new Error("No productId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await Product.findByIdAndRemove(req.params.productId);

    res.status(200).json({
      message: "Product Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
