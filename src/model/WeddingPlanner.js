const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema({
  name: String,
  relation: String,
});

const vendorSchema = new mongoose.Schema({
  id: Number,
  type: String,
  name: String,
  contractSigned: Boolean,
  image: String,
  description: String,
});

const coupleDetailsSchema = new mongoose.Schema({
  groomName: String,
  brideName: String,
  groomImage: String,
  brideImage: String,
  weddingDate: String,
  venue: String,
  venueImage: String,
  venueDescription: String,
  venueAddress: String,
  story: String,
  storyHeading: String,
  bannerImage: String,
});

const eventSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  eventName: { type: String, required: true },
  name: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String },
  completed: { type: Boolean, default: false },
  notes: { type: String },
  image: { type: String },
  description: { type: String },
  attendingGuests: [Number],
});

const categorySchema = new mongoose.Schema({
  category: String,
});

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  eventCategory: { type: String, required: true },
  dateCategory: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const guestMemberSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  isAdult: { type: Boolean, default: true },
  attending: {
    type: String,
    enum: ["attending", "not attending", "doubtful"],
    default: "doubtful",
  },
});

const guestSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  relationship: String,
  category: String,
  phone: String,
  address: String,
  city: String,
  pin: String,
  email: String,
  isHead: { type: Boolean, default: true },
  attending: {
    type: String,
    enum: ["attending", "not attending", "doubtful"],
    default: "not attending",
  },
  members: [guestMemberSchema],
  digitalInvite: { type: Boolean, default: false },
  printInvite: { type: Boolean, default: false },
  saveTheDate: { type: Boolean, default: false },
  attendanceConfirmed: { type: Boolean, default: false },
});

const arrangementSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  hotel: { type: String, required: true },
  rooms: [
    {
      guestId: { type: Number, required: true },
      room: { type: String },
      checkIn: { type: String },
      members: [Number],
    },
  ],
});

const giftSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  guestId: { type: Number, required: true },
  receivedCash: { type: Number },
  giftItem: { type: String },
  thankYouCash: { type: Number },
  thankYouGift: { type: String },
});

// Add this before the weddingSchema definition
const subsectionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String },
  allocated: { type: Number },
  spent: { type: Number },
});

const vendorBudgetSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String },
  allocated: { type: Number },
  spent: { type: Number },
  subsections: [subsectionSchema],
});

const budgetSchema = new mongoose.Schema({
  totalBudget: { type: Number, required: true },
  vendors: [vendorBudgetSchema],
});

// Calender task
const scheduledTaskSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  date: { type: String },
  task: { type: String },
  time: { type: String },
  completed: { type: Boolean, default: false },
  repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly", "yearly"],
    default: "none",
  },
  originalDate: { type: String, required: true },
});

//Shopping list
const shoppingItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  completed: { type: Boolean, default: false },
  shopName: { type: String },
  shopkeeperName: { type: String },
  address: { type: String },
  phone: { type: String },
  price: { type: Number },
});

const weddingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    whoCreated: {
      type: String,
      enum: ["Bride", "Groom"],
      default: null, // Default value
    },
    coupleDetails: coupleDetailsSchema,
    familyDetails: {
      groomFamily: [familyMemberSchema],
      brideFamily: [familyMemberSchema],
    },
    vendors: [vendorSchema],
    events: [eventSchema],
    categories: [categorySchema],
    tasks: [taskSchema],
    guests: [guestSchema],
    arrangements: [arrangementSchema],
    gifts: [giftSchema],
    budget: budgetSchema,
    scheduledTasks: [scheduledTaskSchema],
    groomShopping: [shoppingItemSchema],
    brideShopping: [shoppingItemSchema],
    groomSide: [shoppingItemSchema],
    brideSide: [shoppingItemSchema],
    relatives: [shoppingItemSchema],
    kids: [shoppingItemSchema],
    others: [shoppingItemSchema],
    specialNotes: [
      {
        id: Number,
        content: String,
        timestamp: String,
        completed: Boolean,
        color: String,
      },
    ],
    memorable: [
      {
        id: Number,
        content: String,
        timestamp: String,
        completed: Boolean,
        color: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wedding", weddingSchema);
