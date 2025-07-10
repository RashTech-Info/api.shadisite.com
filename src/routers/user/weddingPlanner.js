const express = require("express");
const router = express.Router();
const {
  getWeddingData,
  addWedding,
  updateWedding,
  addOrUpdateEvent,
  addOrUpdateCategory,
  deleteCategory,
  addOrUpdateTask,
  addOrUpdateArrangement,
  addOrUpdateGuest,
  addOrUpdateGift,
  addOrUpdateBudget,
  addOrUpdateScheduledTask,
  deleteScheduledTask,
  addOrUpdateShoppingItem,
  deleteShoppingItem,
  addOrUpdateNote,
  deleteNote,
} = require("../../controllers/user/weddingPlanner");
const upload = require("../../middleware/multer");

// All wedding-related images
const weddingImageUpload = upload.fields([
  { name: "groomImage", maxCount: 1 },
  { name: "brideImage", maxCount: 1 },
  { name: "venueImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
  { name: "vendorImages", maxCount: 30 }, // vendor images (optional multiple vendors)
]);

// Route to get wedding data
router.get("/getWedding", getWeddingData);

router.post("/add-wedding", weddingImageUpload, addWedding);
router.put("/update-wedding/:weddingId", weddingImageUpload, updateWedding);
router.put("/event/:weddingId", upload.single("image"), addOrUpdateEvent);
router.patch("/category/:weddingId", addOrUpdateCategory);
router.delete("/delete-category/:weddingId", deleteCategory);
router.patch("/task/:weddingId", addOrUpdateTask);
router.patch("/arrangement", addOrUpdateArrangement);
router.put("/guest", addOrUpdateGuest);
router.patch("/gift", addOrUpdateGift);
router.patch("/budget", addOrUpdateBudget);
router.patch("/scheduledTask", addOrUpdateScheduledTask);
router.delete(
  "/wedding/:weddingId/scheduled-task/:taskId",
  deleteScheduledTask
);
router.put("/shopping/:weddingId/:category", addOrUpdateShoppingItem);
router.delete("/shopping/:weddingId/:category/:itemId", deleteShoppingItem);
router.put("/notes/:weddingId/:noteType", addOrUpdateNote);
router.delete("/notes/:weddingId/:noteType/:noteId", deleteNote);

module.exports = router;
