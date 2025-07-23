const feedBack = require("../../model/review");
const nodemailer = require("nodemailer");

// create feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    const reviewImages = req.files
      ? req.files.map((file) => file.filename)
      : [];
    // Save feedback to MongoDB
    const newFeedback = new feedBack({
      name,
      email,
      message,
      rating,
      reviewImage: reviewImages,
    });

    await newFeedback.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "shadisite.com@gmail.com",
        pass: "chbq vark ciqk agdg", // Use App Password
      },
    });

    // 📩 Email to Admin
    const adminMailOptions = {
      from: "shadisite.com@gmail.com",
      to: "shadisite.com@gmail.com",
      subject: "📝 New Feedback Received",
      html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2a9d8f;">New Feedback Submission</h2>
              <p>A new feedback has been submitted. Details are below:</p>
              <table style="width:100%; border-collapse: collapse;">
                <tr><td style="padding: 8px;"><strong>Name:</strong></td><td>${name}</td></tr>
                <tr><td style="padding: 8px;"><strong>Email:</strong></td><td>${email}</td></tr>
                <tr><td style="padding: 8px;"><strong>Rating:</strong></td><td>${rating} ⭐</td></tr>
                <tr><td style="padding: 8px;"><strong>Message:</strong></td><td>${message}</td></tr>
                ${
                  feedBackImage
                    ? `<tr><td style="padding: 8px;"><strong>Review Image:</strong></td><td><img src="https://yourdomain.com/uploads/${feedBackImage}" width="100"/></td></tr>`
                    : ""
                }
              </table>
              <p style="margin-top: 20px;">Check the admin panel for more details.</p>
              <p style="color: #888;">-- Automated Feedback System</p>
            </div>
          `,
    };

    // 📩 Confirmation Email to User
    const userMailOptions = {
      from: "shadisite.com@gmail.com",
      to: email,
      subject: "🙏 Thank You for Your Feedback!",
      html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
              <h2 style="color: #2a9d8f;">Hello ${name},</h2>
              <p>Thank you for submitting your feedback. We truly appreciate your time and input.</p>

              <h4>Your Submitted Feedback:</h4>
              <ul>
                <li><strong>Rating:</strong> ${rating} ⭐</li>
                <li><strong>Message:</strong> ${message}</li>
              </ul>
              ${
                feedBackImage
                  ? `<p><strong>Attached Image:</strong><br/><img src="https://yourdomain.com/uploads/${feedBackImage}" width="100"/></p>`
                  : ""
              }
              
              <p>If you have any further questions, feel free to reach us at <a href="mailto:rashtechinfo@gmail.com">rashtechinfo@gmail.com</a>.</p>
              <p style="margin-top: 30px;">Best regards,<br><strong>RashTech Info Team</strong></p>
            </div>
          `,
    };

    // Send emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res
      .status(200)
      .json({ message: "Feedback submitted and emails sent successfully." });
  } catch (error) {
    console.error("Error processing feedback:", error);
    res.status(500).json({ message: "Failed to process feedback." });
  }
};

// get all feedbacks
exports.getFeedback = async (req, res) => {
  try {
    const feedbacks = await feedBack.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Failed to fetch feedback." });
  }
};

// update feedback approval status
exports.approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = req.body.approved;

    const feedback = await feedBack.findByIdAndUpdate(
      id,
      { approved: approval },
      { new: true }
    );
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res
      .status(200)
      .json({ message: "Feedback approved successfully.", feedback });
  } catch (error) {
    console.error("Error approving feedback:", error);
    res.status(500).json({ message: "Failed to approve feedback." });
  }
};

// get approved feedbacks
exports.getApprovedFeedback = async (req, res) => {
  try {
    const feedbacks = await feedBack
      .find({ approved: true })
      .sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching approved feedback:", error);
    res.status(500).json({ message: "Failed to fetch approved feedback." });
  }
};

//delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await feedBack.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Failed to delete feedback." });
  }
};
