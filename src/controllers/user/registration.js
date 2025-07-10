const user = require("../../model/user");
const bcrypt = require("bcrypt");
exports.userRegister = async (req, res) => {
  try {
    let {
      name,
      email,
      pass: password,
      mobile,
      state,
      city,
      country,
      address,
      zipCode,
    } = req.body;

    // Check if an admin already exists
    let existingAdmin = await user.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: `This ${email} already exists.Try another email`,
      });
    }

    // Check if password is provided and not empty
    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let rec = new user({
      name,
      mobile,
      email,
      pass: hashedPassword,
      city,
      country,
      state,
      zipCode,
      address,
      role: "User",
    });

    let saved_data = await rec.save();

    if (saved_data) {
      return res.status(201).json({
        message: "User registered successfully",
        data: saved_data,
        success: true,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "User registration failed",
      });
    }
  } catch (error) {
    console.error("Error in user register API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
