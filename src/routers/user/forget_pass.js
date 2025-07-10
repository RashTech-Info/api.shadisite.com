let {
change_pass,otpVerify,otp_Send
} = require("../../controllers/user/forget_pass");
let express = require("express");
let router = express.Router();
let auth = require("../../../auth/userauth");

router.post("/send_otp", otp_Send);
router.post("/verify", otpVerify);
router.post("/changePass", change_pass);

module.exports = router;
