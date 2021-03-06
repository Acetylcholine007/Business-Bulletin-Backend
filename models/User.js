const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    accountType: {
      type: Number,
      default: 1,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    profileUri: {
      type: String,
    },
    businesses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Business",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
