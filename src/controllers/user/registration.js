const user = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    // Check if user already exists
    let existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `This ${email} already exists. Try another email.`,
      });
    }

    // Check if password is provided
    if (!password || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new user({
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

    const savedUser = await newUser.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { _id: savedUser._id.toString(), email: savedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("New Registration id---:", savedUser._id);

    await user.findByIdAndUpdate({ _id: savedUser._id }, { auth_key: token });
    // Optional: set JWT as cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true, // only send over HTTPS
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Respond with token and user data
    return res.status(201).json({
      success: true,
      message: "User registered and logged in successfully",
      data: savedUser,
      token: token,
    });
  } catch (error) {
    console.error("Error in user register API:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
