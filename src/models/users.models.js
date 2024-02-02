const { mongoose, Schema } = require("mongoose");

// Create schema to save user registered account
const RegSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const user = mongoose.model("user", RegSchema);
module.exports = user;
