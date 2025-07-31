const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String },
  date: { type: String },
  time: { type: String },
  location: { type: String },
});

const rsvpEntrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  mobile: { type: String },
  response: {
    type: String,
    enum: ["Yes", "No", "Maybe"],
    required: true,
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const weddingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  templateId: { type: String, required: true },
  groomName: { type: String, required: true },
  groomImage: { type: String },
  brideName: { type: String, required: true },
  brideImage: { type: String },
  weddingDate: { type: String, required: true },
  location: { type: String, required: true },
  familyName: { type: String },
  story: { type: String },
  groomSurname: { type: String },
  brideSurname: { type: String },
  groomFatherName: { type: String },
  brideFatherName: { type: String },
  groomMotherName: { type: String },
  brideMotherName: { type: String },
  events: [eventSchema],
  rsvpDeadline: { type: String },
  image: [String],
  videoUrl: { type: String },
  rsvpEnabled: { type: Boolean, default: true },
  sitePassword: { type: String },
  customUrl: { type: String, unique: true },
  familyMemberName: [String],
  residence: { type: String },
  familyContactNumber: [String],
  backgroundImage: { type: String },

  // Embedded RSVP Responses
  rsvpResponses: [rsvpEntrySchema],
});

module.exports = mongoose.model("livewedding", weddingSchema);
