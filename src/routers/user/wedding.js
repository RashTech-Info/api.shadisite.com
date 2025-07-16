const express = require("express");
const router = express.Router();
const {
  getWeddings,
  getWeddingsByUserId,
  createWedding,
  updateWedding,
  addRSVP,
  createUrl,
  getRSVPs,
} = require("../../controllers/user/wedding");
const upload = require("../../middleware/multer");

const imageUpload = upload.fields([
  { name: "groomImage", maxCount: 1 },
  { name: "brideImage", maxCount: 1 },
  { name: "image", maxCount: 10 },
  { name: "backgroundImage", maxCount: 1 },
]);

// Get weddings
router.get("/getWedding/:customUrl", getWeddings);
router.get("/getWeddingByUserId", getWeddingsByUserId);
router.post("/create-wedding", imageUpload, createWedding);
router.patch("/createURL", createUrl);
router.patch("/updateWedding/:id", imageUpload, updateWedding);
router.post("/rsvp", addRSVP);
router.get("/getRsvp", getRSVPs);
module.exports = router;
