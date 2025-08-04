const Wedding = require("../../model/liveWedding");
const User = require("../../model/user"); // if you want to validate user existence

// Get weddings
exports.getWeddings = async (req, res) => {
  try {
    const customUrl = req.params.customUrl;

    console.log("Fetching weddings for user customUrl: ", customUrl);

    const weddings = await Wedding.findOne({ customUrl: customUrl });
    console.log("Weddings found:", weddings);

    res.status(200).json({
      success: true,
      data: weddings,
      message: "Weddings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching weddings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weddings",
    });
  }
};

exports.getWeddingsByUserId = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const findUser = await User.findOne({ auth_key: token });
    const findUserWedding = await Wedding.findOne({ userId: findUser._id });

    res.status(200).json({
      success: true,
      data: findUserWedding,
      message: "Weddings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching weddings by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weddings by user ID",
    });
  }
};

// Create a new wedding
exports.createWedding = async (req, res) => {
  try {
    const {
      templateId,
      groomName,
      brideName,
      weddingDate,
      location,
      familyName,
      story,
      groomSurname,
      brideSurname,
      groomFatherName,
      brideFatherName,
      groomMotherName,
      brideMotherName,
      events,
      rsvpDeadline,
      videoUrl,
      rsvpEnabled,
      // sitePassword,
      // customUrl,
      familyMemberName,
      residence,
      familyContactNumber,
    } = req.body;

    console.log("Request body:", req.body);

    const token = req.cookies.jwt;

    let findUser = await User.findOne({ auth_key: token });
    if (!findUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    let image = [];
    if (req.files && req.files.image) {
      image = req.files.image.map((file) => file.filename);
    } else if (req.body.image) {
      try {
        image = JSON.parse(req.body.image);
      } catch (e) {
        image = [];
      }
    }

    const newWedding = new Wedding({
      userId: findUser._id,
      templateId,
      groomName,
      brideName,
      weddingDate,
      location,
      familyName,
      story,
      groomSurname,
      brideSurname,
      groomFatherName,
      brideFatherName,
      groomMotherName,
      brideMotherName,
      events: JSON.parse(events),
      rsvpDeadline,
      videoUrl,
      rsvpEnabled: rsvpEnabled === "true",
      familyMemberName: JSON.parse(familyMemberName),
      residence,
      familyContactNumber: JSON.parse(familyContactNumber),
      image,
      groomImage:
        req.files && req.files.groomImage
          ? req.files.groomImage[0].filename
          : "",
      brideImage:
        req.files && req.files.brideImage
          ? req.files.brideImage[0].filename
          : "",
      backgroundImage:
        req.files && req.files.backgroundImage
          ? req.files.backgroundImage[0].filename
          : "",
    });

    await newWedding.save();

    res.status(201).json({
      success: true,
      message: "Wedding created successfully",
      data: newWedding,
    });
  } catch (error) {
    console.error("Error creating wedding:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create wedding",
    });
  }
};

// create and check URL
exports.createUrl = async (req, res) => {
  try {
    const { sitePassword, customUrl } = req.body;
    const token = req.cookies.jwt;
    const findUser = await User.findOne({ auth_key: token });
    if (!findUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const id = findUser._id;
    const checkUrl = await Wedding.findOne({ customUrl });
    if (checkUrl) {
      return res.status(200).json({
        success: false,
        message: "This URL is already taken. Please choose another.",
      });
    }
    const updateWedding = await Wedding.findOneAndUpdate(
      { userId: id },
      { customUrl: customUrl, sitePassword: sitePassword },
      { new: true }
    );
    if (!updateWedding) {
      return res.status(404).json({
        success: false,
        message: "Wedding not found for this user",
      });
    }
    res.status(200).json({
      success: true,
      message: "URL and password added successfully",
      data: updateWedding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update Wedding
exports.updateWedding = async (req, res) => {
  try {
    const {
      groomName,
      brideName,
      weddingDate,
      location,
      familyName,
      story,
      GroomSurname,
      BrideSurname,
      groomFatherName,
      brideFatherName,
      groomMotherName,
      brideMotherName,
      events,
      rsvpDeadline,
      videoUrl,
      rsvpEnabled,
      familyMemberName,
      residence,
      familyContactNumber,
    } = req.body;

    const weddingId = req.params.id;

    // // If customUrl is being updated, check for duplicates
    // if (customUrl) {
    //   const existingWedding = await Wedding.findOne({
    //     customUrl,
    //     _id: { $ne: weddingId },
    //   });
    //   if (existingWedding) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "This URL is already taken. Please choose another.",
    //     });
    //   }
    // }

    // Build update object
    const updatedFields = {
      groomName,
      brideName,
      weddingDate,
      location,
      familyName,
      story,
      GroomSurname,
      BrideSurname,
      groomFatherName,
      brideFatherName,
      groomMotherName,
      brideMotherName,
      rsvpDeadline,
      videoUrl,
      rsvpEnabled: rsvpEnabled === "true",
      residence,
    };

    if (events) updatedFields.events = JSON.parse(events);
    if (familyMemberName)
      updatedFields.familyMemberName = JSON.parse(familyMemberName);
    if (familyContactNumber)
      updatedFields.familyContactNumber = JSON.parse(familyContactNumber);

    // Handle optional image updates (save only filename)
    // --- Updated logic for image field ---
    if (req.files && req.files.image) {
      updatedFields.image = req.files.image.map((file) => file.filename);
    } else if (req.body.image) {
      try {
        updatedFields.image = JSON.parse(req.body.image);
      } catch (e) {
        updatedFields.image = [];
      }
    }

    if (req.files.groomImage) {
      updatedFields.groomImage = req.files.groomImage[0].filename;
    }
    if (req.files.brideImage) {
      updatedFields.brideImage = req.files.brideImage[0].filename;
    }
    if (req.files.backgroundImage) {
      updatedFields.backgroundImage = req.files.backgroundImage[0].filename;
    }

    const updatedWedding = await Wedding.findByIdAndUpdate(
      weddingId,
      updatedFields,
      { new: true }
    );

    if (!updatedWedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    res.status(200).json({
      success: true,
      message: "Wedding updated successfully",
      data: updatedWedding,
    });
  } catch (error) {
    console.error("Error updating wedding:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update wedding" });
  }
};

// Add RSVP
exports.addRSVP = async (req, res) => {
  try {
    const { weddingId } = req.body;
    const { name, address, mobile, response, notes } = req.body;

    const wedding = await Wedding.findByIdAndUpdate(
      weddingId,
      {
        $push: {
          rsvpResponses: { name, address, mobile, response, notes },
        },
      },
      { new: true }
    );

    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    res.status(200).json({
      success: true,
      message: "RSVP submitted successfully",
      data: wedding.rsvpResponses[wedding.rsvpResponses.length - 1],
    });
  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({ success: false, message: "Failed to submit RSVP" });
  }
};

// Get RSVP responses
exports.getRSVPs = async (req, res) => {
  try {
    const userid = req.body.userId;
    console.log("Fetching RSVPs for user ID:-----------------", userid);

    const wedding = await Wedding.findOne({ userId: userid });

    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    res.status(200).json({
      success: true,
      rsvpResponses: wedding.rsvpResponses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get RSVPs" });
  }
};
