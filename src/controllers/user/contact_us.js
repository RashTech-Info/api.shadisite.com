const nodemailer = require("nodemailer");
const axios = require("axios");
const SECRET = "6LeCIygrAAAAAIk3InqL_ykWyb21XS17TVgLMcji"; // Your secret key for reCAPTCHA

// VanBagh contact us
exports.contactUs = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log("contact req---", req.body);

    let recaptchaValue = req.body.recaptchaValue; // Assuming you are sending recaptcha value from client

    axios({
      url: `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${recaptchaValue}`,
      method: "POST",
    }).then(async ({ data }) => {
      console.log(data);

      if (data.success) {
        // Create a transporter (Use your email service SMTP settings)
        let transporter = nodemailer.createTransport({
          service: "gmail", // or use SMTP host like smtp.example.com
          auth: {
            user: "developerinfo1212@gmail.com",
            pass: "cocb txob mfpk zrar", // Replace with your app password (if using Gmail, enable App Passwords)
          },
        });

        // Email options
        let mailOptions = {
          from: "developerinfo1212@gmail.com", // Fixed Gmail sender
          replyTo: email, // User's actual email (they will receive replies)
          to: "developerinfo1212@gmail.com",
          subject: "New Contact Form Submission",
          html: `
          <h2>Contact Form Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
          message: "Thank you for contacting us. We will get back to you soon.",
        });
      } else {
        res.status(400).json({ message: "Recaptcha verification failed!" });
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};