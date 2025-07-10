let express = require("express");
const { userChange_pass } = require("../../controllers/user/userChangePass");
let router = express.Router();
let auth = require("../../../auth/userauth");

router.put("/userChange_Pass", auth, userChange_pass);

module.exports = router;
