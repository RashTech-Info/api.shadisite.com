const express = require("express");
const router = express.Router();
const {
  addBioData,
  updateBioData,
  getBioDataByUserId,
} = require("../../controllers/user/bioData");
const multer = require("multer");

let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/gallery");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
});

// Create biodata
router.post("/createBioData", upload.single("image"), addBioData);

// Update biodata
router.put("/bioDataUpdate/:id", upload.single("image"), updateBioData);

// Get biodata by user ID
router.get("/bioData/:userId", getBioDataByUserId);

module.exports = router;
