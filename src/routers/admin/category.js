let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} = require("../../controllers/admin/category");


router.get("/getAllCategories", getAllCategories);
router.post("/addCategory", addCategory);
router.patch("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;
