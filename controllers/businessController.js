const { validationResult } = require("express-validator/check");
const Business = require("../models/Business");
const Product = require("../models/Product");
const Service = require("../models/Service");
mongoose = require("mongoose");

exports.getBusinesses = async (req, res, next) => {
  try {
    const perPage = 12;
    const query = req.query.query || "";
    const currentPage = req.query.page || 1;
    let queryTarget = req.query.target;
    switch (req.query.target) {
      case "firstname":
        queryTarget = "firstname";
        break;
      case "lastname":
        queryTarget = "lastname";
        break;
      case "email":
        queryTarget = "email";
        break;
      default:
        queryTarget = null;
    }

    const totalItems = await Business.find(
      query
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    ).countDocuments();
    const businesses = await Business.find(
      query
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("products")
      .populate("services");

    res.status(200).json({
      message: "Businesses fetched successfully.",
      businesses,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.businessId)
      .populate("products")
      .populate("services");
    if (!business) {
      const error = new Error("Could not find business");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Business fetched", business });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postBusiness = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const businessId = new mongoose.Types.ObjectId();
    const products = req.body.products;
    const services = req.body.services;
    const productIds = [];
    const serviceIds = [];

    for (const product of products) {
      const newProduct = new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        business: businessId,
      });
      productIds.push(newProduct._id);
      await newProduct.save();
    }

    for (const service of services) {
      const newService = new Service({
        name: service.name,
        description: service.description,
        price: service.price,
        business: businessId,
      });
      serviceIds.push(newService._id);
      await newService.save();
    }

    const business = new Business({
      _id: businessId.toHexString(),
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      contactNo: req.body.contactNo,
      owner: req.body.userId,
      products: productIds,
      services: serviceIds,
      tags: req.body.tags,
      lat: req.body.lat,
      lng: req.body.lng,
    });

    await business.save();
    res.status(200).json({
      message: "Business added",
      buoy,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchBusiness = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const business = await Business.findById(req.params.businessId);
    const business2 = await Business.findOne({ name: req.body.name });
    if (!business) {
      const error = new Error("Business does not exists");
      error.statusCode = 422;
      throw error;
    }

    if (business.name !== req.body.name && business2) {
      const error = new Error("Business name already exists");
      error.statusCode = 422;
      throw error;
    }

    business.name = req.body.name;
    business.description = req.body.description;
    business.address = req.body.address;
    business.contactNo = req.body.contactNo;
    business.tags = req.body.tags;
    business.lat = req.body.lat;
    business.lng = req.body.lng;

    await business.save();
    res.status(200).json({
      message: "Business updated",
      buoy: business,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteBusiness = async (req, res, next) => {
  try {
    if (req.params.businessId === undefined) {
      const error = new Error("No businessId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await Business.findByIdAndRemove(req.params.businessId);

    res.status(200).json({
      message: "Business Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
