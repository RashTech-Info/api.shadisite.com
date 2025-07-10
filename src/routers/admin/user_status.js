let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const { user_blocked } = require("../../controllers/admin/user_status");

router.post("/block_user", auth, user_blocked);

module.exports = router;
