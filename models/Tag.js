const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
