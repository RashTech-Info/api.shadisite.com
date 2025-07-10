const express = require("express");
const router = express.Router();
const {
  getWeddings,
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
router.get("/getWedding", getWeddings);
router.post("/create-wedding", imageUpload, createWedding);
router.patch("/createURL", createUrl);
router.put("/updateWedding/:id", imageUpload, updateWedding);
router.post("/rsvp", addRSVP);
router.get("/getRsvp", getRSVPs);
module.exports = router;
