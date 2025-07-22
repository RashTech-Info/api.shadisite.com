let express = require("express");
let router = express.Router();
const {  addFormData } = require("../../controllers/user/weddingform");
let auth = require("../../../auth/userauth");

router.patch("/weddingFormData", auth, addFormData);

module.exports = router;
