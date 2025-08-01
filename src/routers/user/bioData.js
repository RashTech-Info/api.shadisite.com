const express = require("express");
const router = express.Router();
const {
  addBioData,
  updateBioData,
  getBioDataByUserId,
} = require("../../controllers/user/bioData");
const multer = require("multer");
let auth = require("../../../auth/userauth");
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
router.post(
  "/createBioData",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    // for image upload
  ]),
  addBioData
);

// Update biodata
router.patch(
  "/bioDataUpdate/:id",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bioDataFile", maxCount: 1 }, // for PDF upload
  ]),
  updateBioData
);

// Get biodata by user ID
router.get("/bioData", auth, getBioDataByUserId);

module.exports = router;
