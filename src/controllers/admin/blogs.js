const blogModel = require("../../model/blogs");
const blogCategoryModel = require("../../model/blogCategory");

exports.addblogCategory = async (req, res) => {
  try {
    let categoryName = req.body.categoryName;
    const category = await blogCategoryModel.find({});
    if (!category.categoryName) {
      const newCategory = new blogCategoryModel({
        categoryName: categoryName,
      });
      await newCategory.save();
      res.status(200).json({
        message: "Category added successfully",
        category: newCategory,
      });
    } else {
      res.status(404).json({ message: "No categories found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateBlogCategory = async (req, res) => {
  try {
    let categoryName = req.body.categoryName;
    const categoryId = req.params.id;
    const category = await blogCategoryModel.findOne({ _id: categoryId });
    if (category) {
      category.categoryName = categoryName;
      await category.save();
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteBlogCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await blogCategoryModel.findByIdAndDelete(categoryId);
    if (category) {
      res.status(200).json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllBlogCategories= async (req, res) => {
  const categories = await blogCategoryModel.find();
  res.status(200).json({ categories });
}

// get blog-----------

exports.getAllBlog = async (req,res)=> {
  try {
    const blog = await blogModel.find();
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBlogById = async (req,res)=> {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addBlog = async (req, res) => {
  try {
    const { category, date, blog_title, description } = req.body;

    const newBlog = new blogModel({
      category,
      date,
      blog_title,
      description,
      blog_image: req.file ? req.file.filename : null,
    });

    await newBlog.save();

    res.status(200).json({
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { category, date, blog_title, description } = req.body;

    const blog = await blogModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update fields
    blog.blog_title = blog_title || blog.blog_title;
    blog.category = category || blog.category;
    blog.date = date || blog.date;
    blog.description = description || blog.description;

    // If a new image is uploaded
    if (req.file) {
      blog.blog_image = req.file.filename;
    }

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await blogModel.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
