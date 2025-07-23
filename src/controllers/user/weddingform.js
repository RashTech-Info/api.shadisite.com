const userModel = require("../../model/user");

exports.addFormData = async (req, res) => {
  try {
    const whoCreated = req.body.whoCreated;
    const weddingDate = req.body.weddingDate;
    const venue = req.body.venue;
    const brideName = req.body.brideName;
    const groomName = req.body.groomName;
    const token = req.cookies.rashjwt;

    if (!whoCreated || !weddingDate || !venue || !brideName || !groomName || !token) {
      return res.status(400).json({ message: "All fields are required. And unauthorized." });

    }

    const userFind = await userModel.findOneAndUpdate(
      { auth_key: token },
      {
        $set: {
          whoCreated,
          weddingDate,
          venue,
          brideName,
          groomName,
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "Wedding form data added successfully.",
        data: userFind,
      });
  } catch (error) {
    console.error("Error adding wedding form data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
