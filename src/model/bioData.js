const mongoose = require("mongoose");

const bioDataSchema = new mongoose.Schema({
  // top header
  godImage: { type: String },
  mantra: { type: String },
  biodataTitle: { type: String },

  // Personal Detail
  fullName: { type: String },
  dateOfBirth: { type: String },
  timeOfBirth: { type: String },
  placeOfBirth: { type: String },
  manglik: { type: String },
  rashi: { type: String },
  gan: { type: String },
  gotra: { type: String },
  nationality: { type: String },
  religion: { type: String },
  complexion: { type: String },
  bodyType: { type: String },
  height: { type: String },
  weight: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  education: { type: String },
  occupation: { type: String },
  jobPlace: { type: String },
  income: { type: String },
  diet: { type: String },
  hobbies: { type: String },
  maritalStatus: { type: String },
  caste: { type: String },
  subCaste: { type: String },

  // Family Details
  grandFather: { type: String },
  grandMother: { type: String },
  fatherName: { type: String },
  motherName: { type: String },
  fatherOccupation: { type: String },
  motherOccupation: { type: String },
  brother: { type: String },
  sister: { type: String },
  kids: { type: String }, // if married
  familyAbout: { type: String },

  // Other Details
  aboutMyself: { type: String },
  expectation: { type: String },

  // Contact Details
  contactPerson: { type: String },
  email: { type: String },
  phone: { type: String },
  homeTown: { type: String },
  permanentAddress: { type: String },
  presentAddress: { type: String },

  // Finish
  paymentStatus: { type: String }, // e.g., "Pending", "Paid"
  image: { type: String },
  paymentStatus: { type: String, default: "Pending" },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  // System Details
  createdAt: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  userName: { type: String },
  userEmail: { type: String },
  userPhone: { type: String },
  template_id: { type: [String] },
});

const bioDataModel = mongoose.model("biodata", bioDataSchema);
module.exports = bioDataModel;
