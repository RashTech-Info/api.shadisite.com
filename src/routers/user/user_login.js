let { userLogin } = require("../../controllers/user/user_login");
let express = require("express");
let router = express.Router();
require("dotenv").config();

const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/user_login", userLogin);
// ✅ Step 1: Store selected role in cookie and redirect to Google
// router.get("/auth/google/set-role", (req, res) => {
//   res.cookie("selectedRole", role, {
//     maxAge: 5 * 60 * 1000, // Valid for 5 minutes
//     httpOnly: true,
//   });

//   res.redirect("/auth/google");
// });

// ✅ Step 2: Trigger Google OAuth
// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// // ✅ Step 3: Handle Google callback
// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { session: false }),
//   async (req, res) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ message: "Authentication failed" });
//       }

//       const { user, token } = req.user;

//       // ✅ Set JWT token in cookie
//       res.cookie("jwt", token, {
//         httpOnly: true,
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//       });

//       res.redirect(`http://localhost:5173/${redirectPath}`);
//     } catch (error) {
//       console.error("OAuth Callback Error:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

module.exports = router;
