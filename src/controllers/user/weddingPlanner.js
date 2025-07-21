const Wedding = require("../../model/WeddingPlanner");
const User = require("../../model/user"); // if you want to validate user existence

// Get wedding data
exports.getWeddingData = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const findUser = await User.findOne({ auth_key: token });
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const wedding = await Wedding.findOne({ userId: findUser._id });
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    return res.status(200).json({ success: true, data: wedding });
  } catch (error) {
    console.error("Error get wedding:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.addWedding = async (req, res) => {
  try {
    const {
      coupleDetails: coupleDetailsString,
      familyDetails: familyDetailsString,
      vendors: vendorsString,
    } = req.body;
    const token = req.cookies.jwt;
    const findUser = await User.findOne({ auth_key: token });
    const userId = findUser._id;
    if (!findUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Parse optional JSON fields safely
    let coupleDetails = null;
    let familyDetails = null;
    let vendors = [];

    try {
      coupleDetails = coupleDetailsString
        ? JSON.parse(coupleDetailsString)
        : null;
    } catch (err) {
      console.warn("Invalid coupleDetails JSON:", err);
    }

    try {
      familyDetails = familyDetailsString
        ? JSON.parse(familyDetailsString)
        : null;
    } catch (err) {
      console.warn("Invalid familyDetails JSON:", err);
    }

    try {
      vendors = vendorsString ? JSON.parse(vendorsString) : [];
    } catch (err) {
      console.warn("Invalid vendors JSON:", err);
    }

    // Attach uploaded files to respective fields if they exist
    const files = req.files || {};

    if (coupleDetails) {
      coupleDetails.groomImage = files.groomImage?.[0]?.filename || null;
      coupleDetails.brideImage = files.brideImage?.[0]?.filename || null;
      coupleDetails.venueImage = files.venueImage?.[0]?.filename || null;
      coupleDetails.bannerImage = files.bannerImage?.[0]?.filename || null;
    }

    // Attach vendor images
    if (vendors?.length && files.vendorImages?.length) {
      vendors.forEach((vendor, index) => {
        vendor.image = files.vendorImages[index]?.filename || null;
      });
    }

    const newWedding = new Wedding({
      userId,
      coupleDetails: coupleDetails || null,
      familyDetails: familyDetails || null,
      vendors: vendors.length ? vendors : [],
    });

    await newWedding.save();
    return res.status(201).json({
      success: true,
      message: "Wedding added successfully",
      data: newWedding,
    });
  } catch (error) {
    console.error("Error adding wedding:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// update details--------------------------
exports.updateWedding = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const {
      coupleDetails: coupleDetailsString,
      familyDetails: familyDetailsString,
      vendors: vendorsString,
    } = req.body;

    const coupleDetails = coupleDetailsString
      ? JSON.parse(coupleDetailsString)
      : null;
    const familyDetails = familyDetailsString
      ? JSON.parse(familyDetailsString)
      : null;
    const vendors = vendorsString ? JSON.parse(vendorsString) : null;

    const files = req.files;

    // Add uploaded file names if available
    if (coupleDetails) {
      if (files.groomImage)
        coupleDetails.groomImage = files.groomImage[0].filename || "";
      if (files.brideImage)
        coupleDetails.brideImage = files.brideImage[0].filename || "";
      if (files.venueImage)
        coupleDetails.venueImage = files.venueImage[0].filename || "";
      if (files.bannerImage)
        coupleDetails.bannerImage = files.bannerImage[0].filename || "";
    }

    if (vendors && files.vendorImages && files.vendorImages.length) {
      vendors.forEach((vendor, index) => {
        if (files.vendorImages[index]) {
          vendor.image = files.vendorImages[index].filename;
        }
      });
    }

    const updatedWedding = await Wedding.findByIdAndUpdate(
      weddingId,
      {
        ...(coupleDetails && { coupleDetails }),
        ...(familyDetails && { familyDetails }),
        ...(vendors && { vendors }),
      },
      { new: true }
    );

    if (!updatedWedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Wedding updated successfully",
      data: updatedWedding,
    });
  } catch (error) {
    console.error("Error updating wedding:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Program Section -------------------------------
exports.addOrUpdateEvent = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const newEvent = req.body;

    if (!newEvent || !newEvent.id) {
      return res.status(400).json({
        success: false,
        message: "Event data with a valid 'id' is required",
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    // Attach uploaded image filename if present
    if (req.file) {
      newEvent.image = req.file.filename;
    }

    // Convert attendingGuests from string to array if needed
    if (typeof newEvent.attendingGuests === "string") {
      newEvent.attendingGuests = JSON.parse(newEvent.attendingGuests);
    }

    // Check if event with same id exists
    const index = wedding.events.findIndex((event) => event.id == newEvent.id);

    if (index !== -1) {
      // ✅ Update existing event
      wedding.events[index] = {
        ...wedding.events[index].toObject(),
        ...newEvent,
      };
    } else {
      // ✅ Add new event
      wedding.events.push(newEvent);
    }

    await wedding.save();
    return res.status(200).json({
      success: true,
      message: "Event added/updated",
      data: wedding.events,
    });
  } catch (error) {
    console.error("Error adding/updating event:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// delete category --------------------------
exports.deleteCategory = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    // Filter out the category to be deleted
    wedding.categories = wedding.categories.filter(
      (cat) => cat.category !== category
    );

    await wedding.save();
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: wedding.categories,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// category Section --------------------------
exports.addOrUpdateCategory = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const newCategory = req.body;

    if (!newCategory || !newCategory.category) {
      return res.status(400).json({
        success: false,
        message: "Category data with a valid 'category' is required",
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    // Check if category already exists
    const index = wedding.categories.findIndex(
      (cat) => cat.category === newCategory.category
    );

    if (index !== -1) {
      // ✅ Update existing category
      wedding.categories[index] = {
        ...wedding.categories[index].toObject(),
        ...newCategory,
      };
    } else {
      // ✅ Add new category
      wedding.categories.push(newCategory);
    }

    await wedding.save();
    return res.status(200).json({
      success: true,
      message: "Category added",
      data: wedding.categories,
    });
  } catch (error) {
    console.error("Error adding/updating category:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Checklist --------------------------
exports.addOrUpdateTask = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const newTask = req.body;

    if (!newTask || !newTask.id) {
      return res
        .status(400)
        .json({ success: false, message: "Task must include an 'id'" });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    const index = wedding.tasks.findIndex((task) => task.id === newTask.id);

    if (index !== -1) {
      // ✅ Update existing task
      wedding.tasks[index] = { ...wedding.tasks[index].toObject(), ...newTask };
    } else {
      // ✅ Add new task
      wedding.tasks.push(newTask);
    }

    await wedding.save();
    res.status(200).json({
      success: true,
      message: "Task added/updated",
      data: wedding.tasks,
    });
  } catch (error) {
    console.error("Error in task update:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//add Guest
exports.addOrUpdateGuest = async (req, res) => {
  try {
    const { weddingId, guestData } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const index = wedding.guests.findIndex((g) => g.id === guestData.id);

    if (index > -1) {
      // Update existing guest
      wedding.guests[index] = guestData;
    } else {
      // Add new guest
      wedding.guests.push(guestData);
    }

    await wedding.save();
    res.status(200).json({
      message: "Guest added/updated successfully",
      guests: wedding.guests,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Arrangement
exports.addOrUpdateArrangement = async (req, res) => {
  try {
    const { weddingId, arrangementData } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const index = wedding.arrangements.findIndex(
      (a) => a.id === arrangementData.id
    );

    if (index > -1) {
      // Update existing
      wedding.arrangements[index] = arrangementData;
    } else {
      // Add new
      wedding.arrangements.push(arrangementData);
    }

    await wedding.save();
    res.status(200).json({
      message: "Arrangement added/updated successfully",
      arrangements: wedding.arrangements,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// add or  update gift
exports.addOrUpdateGift = async (req, res) => {
  try {
    const { weddingId, giftData } = req.body;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) return res.status(404).json({ message: "Wedding not found" });

    const index = wedding.gifts.findIndex((g) => g.id === giftData.id);

    if (index > -1) {
      // Update existing
      wedding.gifts[index] = giftData;
    } else {
      // Add new
      wedding.gifts.push(giftData);
    }

    await wedding.save();
    res.status(200).json({
      message: "Gift added/updated successfully",
      gifts: wedding.gifts,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// add or update budget
exports.addOrUpdateBudget = async (req, res) => {
  try {
    const { weddingId, totalBudget, vendors } = req.body;

    if (!totalBudget || !Array.isArray(vendors)) {
      return res.status(400).json({
        success: false,
        message: "totalBudget and vendors array are required",
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res.status(404).json({
        success: false,
        message: "Wedding not found",
      });
    }

    // ✅ Add or update budget
    wedding.budget = { totalBudget, vendors };
    await wedding.save();

    return res.status(200).json({
      success: true,
      message: "Budget added/updated",
      data: wedding.budget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add or update scheduled task
exports.addOrUpdateScheduledTask = async (req, res) => {
  try {
    const { weddingId } = req.body;
    const taskData = req.body;

    console.log("request body:", req.body);

    if (!taskData || !taskData.id) {
      return res
        .status(400)
        .json({ success: false, message: "Task 'id' is required" });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    const index = wedding.scheduledTasks.findIndex(
      (task) => task.id === taskData.id
    );

    if (index !== -1) {
      // Update existing task
      wedding.scheduledTasks[index] = {
        ...wedding.scheduledTasks[index].toObject(),
        ...taskData,
      };
    } else {
      // Add new task
      wedding.scheduledTasks.push(taskData);
    }

    await wedding.save();
    return res.status(200).json({
      success: true,
      message: "Scheduled task added/updated",
      data: wedding.scheduledTasks,
    });
  } catch (error) {
    console.error("Error in addOrUpdateScheduledTask:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete scheduled task
exports.deleteScheduledTask = async (req, res) => {
  try {
    const { weddingId, taskId } = req.params;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    const originalLength = wedding.scheduledTasks.length;

    // Filter out the task to delete
    wedding.scheduledTasks = wedding.scheduledTasks.filter(
      (task) => task.id !== parseInt(taskId)
    );

    if (wedding.scheduledTasks.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Scheduled task not found",
      });
    }

    await wedding.save();

    return res.status(200).json({
      success: true,
      message: "Scheduled task deleted",
      data: wedding.scheduledTasks,
    });
  } catch (error) {
    console.error("Error deleting scheduled task:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add or Update Shopping Item
exports.addOrUpdateShoppingItem = async (req, res) => {
  try {
    const { weddingId, category } = req.params;
    const item = req.body;

    if (!item || !item.id) {
      return res.status(400).json({
        success: false,
        message: "Shopping item with valid 'id' is required",
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    if (!Array.isArray(wedding[category])) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    const index = wedding[category].findIndex((i) => i.id === item.id);

    if (index !== -1) {
      // Update
      wedding[category][index] = {
        ...wedding[category][index].toObject(),
        ...item,
      };
    } else {
      // Add
      wedding[category].push(item);
    }

    await wedding.save();
    return res.status(200).json({
      success: true,
      message: "Shopping item added/updated",
      data: wedding[category],
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete Shopping Item
exports.deleteShoppingItem = async (req, res) => {
  try {
    const { weddingId, category, itemId } = req.params;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    if (!Array.isArray(wedding[category])) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    wedding[category] = wedding[category].filter(
      (item) => item.id !== parseInt(itemId)
    );
    await wedding.save();

    return res.status(200).json({
      success: true,
      message: "Shopping item deleted",
      data: wedding[category],
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Add or Update Note (for specialNotes or memorable)
exports.addOrUpdateNote = async (req, res) => {
  try {
    const { weddingId, noteType } = req.params;
    const note = req.body;

    if (!note || !note.id) {
      return res.status(400).json({
        success: false,
        message: "Note with a valid 'id' is required",
      });
    }

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    if (!Array.isArray(wedding[noteType])) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid note type" });
    }

    const index = wedding[noteType].findIndex((n) => n.id === note.id);

    if (index !== -1) {
      // Update
      wedding[noteType][index] = {
        ...wedding[noteType][index].toObject(),
        ...note,
      };
    } else {
      // Add
      wedding[noteType].push(note);
    }

    await wedding.save();
    res.status(200).json({
      success: true,
      message: "Note added/updated",
      data: wedding[noteType],
    });
  } catch (error) {
    console.error("Error in addOrUpdateNote:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Delete Note
exports.deleteNote = async (req, res) => {
  try {
    const { weddingId, noteType, noteId } = req.params;

    const wedding = await Wedding.findById(weddingId);
    if (!wedding) {
      return res
        .status(404)
        .json({ success: false, message: "Wedding not found" });
    }

    if (!Array.isArray(wedding[noteType])) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid note type" });
    }

    wedding[noteType] = wedding[noteType].filter(
      (note) => note.id !== parseInt(noteId)
    );
    await wedding.save();

    res.status(200).json({
      success: true,
      message: "Note deleted",
      data: wedding[noteType],
    });
  } catch (error) {
    console.error("Error in deleteNote:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
