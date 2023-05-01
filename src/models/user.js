const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: String,
  username: String,
  password: String,
  status: {
    type: Boolean,
    default: true,
  },
  role: {
    type: number,
    default: 1,
  },
});

module.exports = mongoose.model("users", UserSchema);
