const bioDataModel = require("../../model/bioData");
const userModel = require("../../model/user");
const nodemailer = require("nodemailer");
const path = require("path");
// const pdfPath = require("../../../public/gallery")
// get biodata by user ID
exports.getBioDataByUserId = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const findUser = await userModel.findOne({ auth_key: token });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const biodata = await bioDataModel.findOne({ userID: findUser._id });

    if (!biodata) {
      return res.status(404).json({ message: "Biodata not found" });
    }

    res.status(200).json(biodata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create biodata
exports.addBioData = async (req, res) => {
  try {
    const data = req.body;
    const token = req.cookies.jwt;

    const findUser = await userModel.findOne({ auth_key: token });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    data.userID = findUser._id;
    data.userName = findUser.name;
    data.userEmail = findUser.email;
    data.userPhone = findUser.phone;

    // Store image if uploaded
    if (req.files?.image) {
      data.image = req.files.image[0].filename;
    }

    // Ensure template_id is always an array
    if (data.template_id) {
      data.template_id = Array.isArray(data.template_id)
        ? data.template_id
        : [data.template_id];
    }

    const newBiodata = new bioDataModel(data);
    await newBiodata.save();

    res
      .status(201)
      .json({ message: "Biodata created successfully", newBiodata });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update biodata
exports.updateBioData = async (req, res) => {
  try {
    const data = req.body;
    const token = req.cookies.jwt;

    const findBioData = await bioDataModel.findById(req.params.id);
    const findUser = await userModel.findOne({ auth_key: token });
    const userEmail = findUser.email;

    // If image file is uploaded
    if (req.files?.image) {
      data.image = req.files.image[0].filename;
    }

    // If PDF file is uploaded
    if (req.files?.bioDataFile) {
      data.bioDataFile = req.files.bioDataFile[0].filename;
    }

    const updated = await bioDataModel.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Biodata not found" });
    }

    // Get the latest bioDataFile name
    const pdfFile = data.bioDataFile || findBioData.bioDataFile;

    // Full path to the PDF
    const filePath = path.join(__dirname, "../../../public/gallery", pdfFile); // adjust path based on your file structure

    // Setup mailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP provider
      auth: {
        user: "developerinfo1212@gmail.com", // your email
        pass: "cocb txob mfpk zrar" // your app password
      },
    });

    const mailOptions = {
      from: "developerinfo1212@gmail.com",
      to: userEmail,
      subject: "Your Updated Biodata PDF",
      text: `Hello ${findUser.name},\n\nYour biodata has been successfully updated.\nPlease find the updated PDF attached.`,
      attachments: [
        {
          filename: pdfFile,
          path: filePath,
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Biodata updated and email sent successfully",
      updated,
    });

  } catch (error) {
    console.error("Error updating biodata and sending mail:", error);
    res.status(500).json({ error: error.message });
  }
};
