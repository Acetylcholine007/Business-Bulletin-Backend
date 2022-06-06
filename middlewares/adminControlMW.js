module.exports = (req, res, next) => {
  if (req.accountType !== 2) {
    const error = new Error("You are not Allowed");
    error.statusCode = 401;
    throw error;
  }
  next();
};
