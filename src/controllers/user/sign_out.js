let user = require("../../model/user");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.Sign_Out = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    console.log("TK", token);

    let data = await user.findOneAndUpdate(
      { auth_key: token },
      { auth_key: null }
    );

    console.log("Data", data);

    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      expires: new Date(Date.now() + 1000), // Force expiration
    });

    if (data) {
      return res.status(200).json({
        message: "User logged out",
        success: true,
      });
    } else {
      return res.status(300).json({
        message: "Error",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
