let userModel = require("../../model/user");
let bcrypt = require("bcrypt");

exports.userChange_pass = async (req, res) => {
  try {
    let token = req.cookies.jwt;
    let password = req.body.pass;
    let newpass = req.body.newpass;
    console.log("newPass", newpass);
    let hashedPassword = await bcrypt.hash(newpass, 10);
    let data = await userModel.findOne({ auth_key: token });
    let check = bcrypt.compareSync(password, data.pass);
    if (!check) {
      return res.status(404).json({
        message: "Password doesn't match",
        success: false,
      });
    }

    let passwordUpdate = await userModel.findOneAndUpdate(
      { auth_key: token },
      { $set: { pass: hashedPassword } }
    );
    if (passwordUpdate) {
      return res.status(200).json({
        data: passwordUpdate,
        success: true,
        status: 200,
        message: "Password Update successfully",
      });
    } else {
      return res.status(300).json({
        data: [],
        success: false,
        status: 300,
        message: "Password Update failed",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
