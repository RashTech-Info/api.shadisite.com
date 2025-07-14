let user = require("../../model/user");

exports.user_profile = async (req, res) => {
  let token = req.cookies.jwt;
  console.log("profile vala token-------", token);
  let data = await user.findOne({ auth_key: token });
  if (data) {
    return res.status(200).json({
      data: data,
      message: "User Profile View",
      success: true,
      status: 200,
    });
  } else {
    return res.status(400).json({
      data: [],
      message: "Can't view user profile",
      success: true,
      status: 400,
    });
  }
};

exports.Update_user = async (req, res) => {
  let name = req.body.name;
  let mobile = req.body.mobile;
  let address = req.body.address;
  let state = req.body.state;
  let dateOfBirth = req.body.dateOfBirth;
  let gender = req.body.gender;
  let city = req.body.city;
  let country = req.body.country;
  let zip = req.body.zipCode;
  let token = req.cookies.jwt;

  // Handle file upload (only update if a new file is uploaded)
  let new_image = req.file ? req.file.filename : null;

  // Fetch the current user to check existing image
  let existing_user = await user.findOne({ auth_key: token });

  if (!existing_user) {
    return res.status(200).json({
      data: [],
      success: false,
      status: 404,
      message: "User not found",
    });
  }

  // Keep the existing image if no new one is uploaded
  let user_image = new_image ? new_image : existing_user.user_image;

  let update_data = await user.findOneAndUpdate(
    { auth_key: token },
    {
      name: name,
      mobile: mobile,
      dateOfBirth: dateOfBirth,
      address: address,
      gender: gender,
      state: state,
      city: city,
      country: country,
      zipCode: zip,
      user_image: user_image,
    },
    { new: true } // return the updated document
  );

  console.log("User", update_data);

  if (update_data) {
    return res.status(200).json({
      data: update_data,
      success: true,
      message: "User details updated",
      status: 200,
    });
  } else {
    return res.status(300).json({
      data: [],
      success: false,
      status: 300,
      message: "User can't update",
    });
  }
};
