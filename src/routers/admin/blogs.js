let {
  addBlog,
  addblogCategory,
  getAllBlogCategories,
  updateBlog,
  deleteBlog,
  deleteBlogCategory,
  updateBlogCategory,
  getAllBlog,
  getBlogById,
} = require("../../controllers/admin/blogs");
let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
let multer = require("multer");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/blog"); // ✅ Ensure this path exists
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

router.post("/addBlogCategory", auth, addblogCategory);
router.put("/updateBlogCategory/:id", auth, updateBlogCategory);
router.delete("/deleteBlogCategory/:id", auth, deleteBlogCategory);
router.get("/getAllBlogCategories", getAllBlogCategories);

// Add Blog
router.get("/getAllBlog", getAllBlog);
router.get("/getBlogById/:id", getBlogById);
router.post("/add-blog", upload.single("blog_image"), addBlog);
router.patch("/update-blog/:id", upload.single("blog_image"), updateBlog);
router.delete("/delete-blog/:id", auth, deleteBlog);

module.exports = router;
