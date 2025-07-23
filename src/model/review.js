const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  message: { type: String },
  rating: { type: Number  },
  reviewImage: { type: [String] },
  createdAt: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("feedback", feedbackSchema);
