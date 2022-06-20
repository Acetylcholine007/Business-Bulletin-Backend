const { validationResult } = require("express-validator/check");
const Business = require("../models/Business");
const Product = require("../models/Product");
const Service = require("../models/Service");
const User = require("../models/User");
mongoose = require("mongoose");

exports.getBusinesses = async (req, res, next) => {
  try {
    const perPage = 12;
    const query = req.query.query || "";
    const currentPage = req.query.page || 1;
    let queryTarget = req.query.target;
    switch (req.query.target) {
      case "name":
        queryTarget = "name";
        break;
      case "address":
        queryTarget = "address";
        break;
      case "contact no.":
        queryTarget = "contactNo";
        break;
      default:
        queryTarget = null;
    }

    const totalItems = await Business.find(
      query !== ""
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    ).countDocuments();
    const businesses = await Business.find(
      query !== ""
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("products")
      .populate("services")
      .populate("owner")
      .populate("tags");

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

exports.getUserBusinesses = async (req, res, next) => {
  try {
    const perPage = 12;
    const query = req.query.query || "";
    const currentPage = req.query.page || 1;
    let queryTarget = req.query.target;
    switch (req.query.target) {
      case "name":
        queryTarget = "name";
        break;
      case "address":
        queryTarget = "address";
        break;
      case "contactno.":
        queryTarget = "contactNo";
        break;
      default:
        queryTarget = null;
    }

    if (req.userId !== req.params.userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const totalItems = await Business.find(
      query !== ""
        ? queryTarget
          ? {
              [queryTarget]: { $regex: query, $options: "i" },
              owner: req.params.userId,
            }
          : { owner: req.params.userId }
        : { owner: req.params.userId }
    ).countDocuments();
    const businesses = await Business.find(
      query !== ""
        ? queryTarget
          ? {
              [queryTarget]: { $regex: query, $options: "i" },
              owner: req.params.userId,
            }
          : { owner: req.params.userId }
        : { owner: req.params.userId }
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("products")
      .populate("services")
      .populate("owner")
      .populate("tags");

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
      .populate("services")
      .populate("owner")
      .populate("tags");
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

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User does not exists");
      error.statusCode = 422;
      throw error;
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    for (const product of products) {
      const newProduct = new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        business: businessId,
        imagesUri: product.imagesUri,
      });
      productIds.push(newProduct._id);
      await newProduct.save({ session: sess });
    }

    for (const service of services) {
      const newService = new Service({
        name: service.name,
        description: service.description,
        price: service.price,
        business: businessId,
        imagesUri: service.imagesUri,
      });
      serviceIds.push(newService._id);
      await newService.save({ session: sess });
    }

    const business = new Business({
      _id: businessId.toHexString(),
      name: req.body.name,
      description: req.body.description,
      address: req.body.address,
      contactNo: req.body.contactNo,
      owner: req.userId,
      products: productIds,
      services: serviceIds,
      tags: req.body.tags,
      coordinates: {
        lat: req.body.coordinates.lat,
        lng: req.body.coordinates.lng,
      },
      logoUri: req.body.logoUri,
      bannerUri: req.body.bannerUri,
      credentials: req.body.credentials,
    });

    user.businesses.push(business);

    await user.save({ session: sess });
    await business.save({ session: sess });
    await sess.commitTransaction();

    res.status(200).json({
      message: "Business added",
      business,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyBusiness = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const business = await Business.findById(req.params.businessId);

    if (!business) {
      const error = new Error("Business does not exists");
      error.statusCode = 422;
      throw error;
    }

    business.isVerified = req.body.isVerified;

    await business.save();
    res.status(200).json({
      message: "Business updated",
      business,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allowBusiness = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const business = await Business.findById(req.params.businessId);

    if (!business) {
      const error = new Error("Business does not exists");
      error.statusCode = 422;
      throw error;
    }

    business.status = req.body.status;

    await business.save();
    res.status(200).json({
      message: "Business updated",
      business,
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

    if (req.userId !== business.owner.toString()) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

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
    business.coordinates = {
      lat: req.body.coordinates.lat,
      lng: req.body.coordinates.lng,
    };
    business.logoUri = req.body.logoUri;
    business.bannerUri = req.body.bannerUri;
    business.credentials = req.body.credentials;

    await business.save();
    res.status(200).json({
      message: "Business updated",
      business,
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

    const business = await Business.findById(req.params.businessId).populate(
      "owner"
    );

    if (!business) {
      const error = new Error("Business does not exists");
      error.statusCode = 422;
      throw error;
    }

    if (req.userId !== business.owner._id.toString()) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await business.remove({ session: sess });
    business.owner.businesses.pull(business);
    await business.owner.save({ session: sess });
    await sess.commitTransaction();

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
