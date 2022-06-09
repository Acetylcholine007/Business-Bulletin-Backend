const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
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

    const totalItems = await User.find(
      query
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    ).countDocuments();
    const users = await User.find(
      query
        ? queryTarget
          ? { [queryTarget]: { $regex: query, $options: "i" } }
          : {}
        : {}
    )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .populate("businesses");

    res.status(200).json({
      message: "Users fetched successfully.",
      users,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (req.accountType !== 2 || req.userId !== req.params.userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const user = await User.findById(req.params.userId).populate("businesses");
    if (!user) {
      const error = new Error("Could not find user");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "User fetched", user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    if (req.userId !== req.params.userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findById(req.params.userId);

    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 12);

    user.password = hashedPw;
    await user.save();
    res.status(200).json({
      message: "Password updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  try {
    if (req.userId !== req.params.userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const userId = req.params.userId;
    const user = await User.findById(userId);

    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.contactNo = req.body.contactNo;
    user.profileUri = req.body.profileUri;
    await user.save();

    res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.allowUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Failed to pass validation");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      const error = new Error("User does not exists");
      error.statusCode = 422;
      throw error;
    }

    user.status = req.body.status;

    await user.save();
    res.status(200).json({
      message: "User updated",
      user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req.userId !== req.params.userId) {
      const error = new Error("Forbidden");
      error.statusCode = 403;
      throw error;
    }
    const userId = req.params.userId;
    if (userId === undefined) {
      const error = new Error("No userId params attached in URL");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      const error = new Error("User does not exists");
      error.statusCode = 422;
      throw error;
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await user.remove({ session: sess });
    //TODO: Add business clearing logic
    await sess.commitTransaction();

    res.status(200).json({
      message: "User Removed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
