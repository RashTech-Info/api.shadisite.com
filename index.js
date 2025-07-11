const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./db/dbconnection");
require("./config/passportConfig"); // Import Passport setup
dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin:[ "https://shadisite.com", "http://localhost:5173" ], // Replace with your frontend URL
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve Static Files
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static("public/uploads"));
app.use("/gallery", express.static("public/gallery"));

// Connect to Database
connectDB();

// Import and Use Routes
const adminRoutes = [
  "admin_login",
  "admin_profile_update",
  "admin_profile",
  "changepass",
  "forgetPass",
  "register",
  "sign_out",
  "user_status",
  "viewUser",
];

adminRoutes.forEach((route) => {
  app.use("", require(`./src/routers/admin/${route}`));
});

const userRoutes = [
  "bioData",
  "contact_us",
  "forget_pass",
  "registration",
  "sign_out",
  "user_login",
  "user_profile",
  "userChangePass",
  "view_transaction",
  "wedding",
  "weddingPlanner",
];

// Load User Routes
userRoutes.forEach((route) => {
  app.use("", require(`./src/routers/user/${route}`));
});

// Start Server

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// Handle Server Errors
app.on("error", (error) => {
  console.error(`❌ Server startup error: ${error.message}`);
});
