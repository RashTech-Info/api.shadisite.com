const {
contactUs
} = require("../../controllers/user/contact_us");
const auth = require("../../../auth/userauth");
const express = require("express");
const router = express.Router();
router.post("/contact-us", contactUs);
module.exports = router;
