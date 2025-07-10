let user = require("../../model/user");
let bioDataModel = require("../../model/bioData");
let liveWedding = require("../../model/liveWedding");
let Wedding = require("../../model/WeddingPlanner");

exports.view = async (req, res) => {
  let token = req.cookies.adjwt;
  if (token) {
    let data = await user.find();
    console.log("User", data);
    if (data) {
      return res.status(200).json({
        data: data,
        message: "All Users",
      });
    }
  } else {
    return res.status(400).json({
      data: [],
      message: "No user found",
    });
  }
};

exports.viewUserData = async (req, res) => {
  try {
    let token = req.cookies.adjwt;
    if (token) {
      // Find the user by ID
      const bioDataDetails = await bioDataModel.find();
      let liveWeddingData = await liveWedding.find();
      const weddings = await Wedding.find();

      // Return the biodata
      res.status(200).json({ bioDataDetails, liveWeddingData, weddings });
    } else {
      return res.status(400).json({
        data: [],
        message: "No user found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// data via user id
exports.viewUserDataById = async (req, res) => {
  try {
    let id = req.params.id;
    // Find the user by ID
    const bioDataDetails = await bioDataModel.findOne({ userID: id });
    let liveWeddingDetails = await liveWedding.findOne({ userId: id });
    const weddingsDetails = await Wedding.findOne({ userId: id });

    // Return the biodata
    res
      .status(200)
      .json({ bioDataDetails, liveWeddingDetails, weddingsDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
