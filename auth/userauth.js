const jwt = require("jsonwebtoken");
const user = require("../src/model/user");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      console.log("JWT Token received:", token);

      const { _id } = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded user ID:", _id);

      const userData = await user.findOne({ _id });
      if (userData) {
        console.log("user found:", userData);
        req.user = userData;
        return next();
      } else {
        console.error("user not found in database");
        return res.status(401).json({ error: "Unauthorized: user not found" });
      }
    } else {
      console.error("JWT Cookie missing");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
