const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    enum: ["user", "admin"], // Enum values for role
    default: "user", // Default value set to 'user'
    required: true,
  },
  services: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hasAccess: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
