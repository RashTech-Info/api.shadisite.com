const Razorpay = require("razorpay");
const crypto = require("crypto");
const bioDataModel = require("../../model/bioData");
const Transaction = require("../../model/transaction"); // import Transaction model
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcptid_${Date.now()}`,
    });

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Verify payment and send email
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      biodataId,
      amount, // get amount dynamically from frontend
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Update biodata with payment info
    const updatedBiodata = await bioDataModel.findByIdAndUpdate(
      biodataId,
      {
        paymentStatus: "Paid",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    // Save transaction dynamically with amount
    await Transaction.create({
      amount: amount,
      userEmail: updatedBiodata.userEmail,
      userName: updatedBiodata.userName,
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      paymentStatus: "Paid",
      template_id: biodataId,
    });

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "developerinfo1212@gmail.com",
        pass: "sfnh cqis vkdk vgbl",
      },
    });

    const mailOptions = {
      from: `Biodata <developerinfo1212@gmail.com>`,
      to: updatedBiodata.userEmail,
      subject: "Payment Receipt - Biodata",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Thank you for your payment!</h2>
          <p>Dear <strong>${updatedBiodata.userName}</strong>,</p>
          <p>We have successfully received your payment of ${amount}.</p>
          <p>You can now download your Biodata.</p>
          <p>Regards,<br/>Biodata</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Payment verified",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
