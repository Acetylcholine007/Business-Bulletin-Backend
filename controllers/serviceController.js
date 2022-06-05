const { validationResult } = require("express-validator/check");
const Service = require("../models/Service");
mongoose = require("mongoose");

<exports className="getServices"></exports> = async (req, res, next) => {
  try {
    const perPage = 12;
    const query = req.query.query || "";
    const currentPage = req.query.page || 1;

    const totalItems = await Service.find(
      query ? { name: { $regex: query, $options: "i" } } : {}
    ).countDocuments();
    const services = await Service.find(
      query ? { name: { $regex: query, $options: "i" } } : {}
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("business");

    res.status(200).json({
      message: "Services fetched successfully.",
      services,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.serviceId).populate(
      "business"
    );
    if (!service) {
      const error = new Error("Could not find service");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Service fetched", service });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const service = new Service({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      business: req.body.businessId,
    });

    await service.save();
    res.status(200).json({
      message: "Service added",
      service,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchService = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const service = await Service.findById(req.params.serviceId);
    const service2 = await Service.findOne({
      name: req.body.name,
      business: req.body.businessId,
    });
    if (!service) {
      const error = new Error("Service does not exists");
      error.statusCode = 422;
      throw error;
    }

    if (service.name !== req.body.name && service2) {
      const error = new Error("Service name already exists");
      error.statusCode = 422;
      throw error;
    }

    service.name = req.body.name;
    service.description = req.body.description;
    service.price = req.body.price;

    await service.save();
    res.status(200).json({
      message: "Service updated",
      service,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    if (req.params.serviceId === undefined) {
      const error = new Error("No serviceId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await Service.findByIdAndRemove(req.params.serviceId);

    res.status(200).json({
      message: "Service Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
