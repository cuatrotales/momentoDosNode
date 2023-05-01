const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarSchema = Schema({
  plateNumber: String,
  brand: String,
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("cars", CarSchema);
