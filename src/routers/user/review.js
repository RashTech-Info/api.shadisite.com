let express = require("express");
const {
  approveFeedback,
  getFeedback,
  submitFeedback,
  getApprovedFeedback,
  deleteFeedback,
} = require("../../controllers/user/review");
let router = express.Router();
let auth = require("../../../auth/adminauth");
const multer = require("multer");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/feedback"); // ✅ Ensure this path exists
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});

// Route to submit feedback
router.post("/submitFeedback", upload.array("reviewImage"), submitFeedback);
// Route to get all feedback
router.get("/getFeedback", auth, getFeedback);
// Route to approve feedback
router.put("/approveFeedback/:id", auth, approveFeedback);
// Route to get approved feedback
router.get("/getApprovedFeedback", getApprovedFeedback);
// Route to delete feedback
router.delete("/deleteFeedback/:id", auth, deleteFeedback);

module.exports = router;
