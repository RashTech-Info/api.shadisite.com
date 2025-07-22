const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true }, // ✅ No unique here
  pass: { type: String }, // Not required for Google OAuth users
  mobile: { type: Number },
  dateOfBirth: { type: String },
  otp: { type: Number },
  gender: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  user_image: {
    type: String,
    default: null,
  },
  registration_Date: {
    type: String,
    default: () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
  },
  whoCreated: {
    type: String,
    enum: ["Bride", "Groom"],
    default: null, // Default value
  },
  weddingDate: { type: String, default: null },
  venue: { type: String, default: null },
  brideName: { type: String, default: null },
  groomName: { type: String, default: null },
  auth_key: { type: String, default: null },
  role: {
    type: String,
    default: "User", // Default role for new users
    required: true,
  },
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
