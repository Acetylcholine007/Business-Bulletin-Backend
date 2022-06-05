const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const businessSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  { timestamps: true },
  { _id: false }
);

module.exports = mongoose.model("Business", businessSchema);
