let express = require("express");
let router = express.Router();
const { Sign_Out } = require("../../controllers/user/sign_out");

router.get("/userSignout", Sign_Out);

module.exports = router;
