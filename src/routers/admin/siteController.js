let express = require("express");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const {
  getSiteToggle,
  updateSiteToggle,
} = require("../../controllers/admin/siteController");

router.get("/site_toggle", getSiteToggle);
router.patch("/site_toggle", auth, updateSiteToggle);

module.exports = router;
