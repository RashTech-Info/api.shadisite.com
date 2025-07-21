const mongoose = require("mongoose");

const siteToggleSchema = new mongoose.Schema({
  toggle: { type: Boolean, default: true },
});

module.exports = mongoose.model("siteToggle", siteToggleSchema);
