// Import required modules
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Define user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    }, // Required if no Google ID
  },
  googleId: {
    type: String,
    required: function () {
      return !this.password;
    }, // Required if no password
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export user model
module.exports = mongoose.model("User", userSchema);
