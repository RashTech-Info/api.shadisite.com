let user = require("../../model/user");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");
require("dotenv").config();

exports.userLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.pass;
    let data = await user.findOne({ email: email });

    if (!data) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        status: 400,
        data: [],
      });
    } else if (data.pass == null) {
      return res.status(300).json({
        message: "Please login with google",
        success: false,
        status: 300,
        data: [],
      });
    } else {
      let check = bcrypt.compareSync(password, data.pass);
      if (check) {
        if (data.user_auth == "Blocked") {
          return res.status(300).json({
            message: "User is blocked. Please contact support for assistance.",
            success: false,
            status: 300,
            data: [],
          });
        } else {
          console.log("User Logged in");
          console.log("ID is" + data._id);

          const token = jwt.sign(
            { _id: data._id.toString() },
            process.env.JWT_SECRET
          );
          console.log("login vala token-------", token);

          await user.findByIdAndUpdate({ _id: data._id }, { auth_key: token });
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: true, // only send over HTTPS
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
          });

          return res.status(200).json({
            message: "Login successful.",
            email: data.email,
            token,
            data: data,
            success: true,
            status: 200,
          });
        }
      } else if (!check) {
        return res.status(300).json({
          message: "Password doesn't match",
          success: false,
          status: 300,
          data: [],
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
