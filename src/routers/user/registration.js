let express = require("express");
let router = express.Router();
const {userRegister } = require("../../controllers/user/registration");

router.post("/userRegistration", userRegister);

module.exports = router;
