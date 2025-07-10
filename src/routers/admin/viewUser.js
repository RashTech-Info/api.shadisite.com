let {
  view,
  viewUserData,
  viewUserDataById,
} = require("../../controllers/admin/viewUser");
let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");

router.get("/viewBioDataUser", auth, view);
router.get("/viewAllUserData", auth, viewUserData);
router.get("/viewUserData/:id", auth, viewUserDataById);

module.exports = router;
