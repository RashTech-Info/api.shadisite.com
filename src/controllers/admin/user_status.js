// let user = require("../../model/user");

exports.user_blocked = async (req, res) => {
  const button = req.body.but;
  const email = req.body.email;

  let updateButton;
  if (button === "Block") {
    updateButton = { user_auth: "Blocked" };
  } else if (button === "Unblock") {
    updateButton = { user_auth: "Unblocked" };
  }

  const data = await user.findOneAndUpdate(
    { email: email },
    { $set: updateButton },
    { new: true }
  );

  if (data) {
    console.log(data);
    return res.status(200).json({
      message: "User updated successfully",
      data: data,
      success: true,
    });
  }
};
