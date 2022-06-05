const { validationResult } = require("express-validator/check");
const Tag = require("../models/Tag");
mongoose = require("mongoose");

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({}).sort({ name: -1 });

    res.status(200).json({
      message: "Tags fetched successfully.",
      tags,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.tagId);
    if (!tag) {
      const error = new Error("Could not find tag");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Tag fetched", tag });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postTag = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const tag = new Tag({
      name: req.body.name,
    });

    await tag.save();
    res.status(200).json({
      message: "Tag added",
      tag,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchTag = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const tag = await Tag.findById(req.params.tagId);
    const tag2 = await Tag.findOne({
      name: req.body.name,
    });
    if (!tag) {
      const error = new Error("Tag does not exists");
      error.statusCode = 422;
      throw error;
    }

    if (tag.name !== req.body.name && tag2) {
      const error = new Error("Tag name already exists");
      error.statusCode = 422;
      throw error;
    }

    tag.name = req.body.name;

    await tag.save();
    res.status(200).json({
      message: "Tag updated",
      tag,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    if (req.params.tagId === undefined) {
      const error = new Error("No tagId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    await Tag.findByIdAndRemove(req.params.tagId);

    res.status(200).json({
      message: "Tag Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
