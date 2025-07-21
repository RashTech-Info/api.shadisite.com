const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
});

module.exports = mongoose.model("BlogCategory", blogCategorySchema);
