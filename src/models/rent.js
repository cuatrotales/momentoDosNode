const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RentSchema = Schema({
  rentNumber: String,
  username: String,
  plateNumber: String,
  rentDate: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("rents", RentSchema);
