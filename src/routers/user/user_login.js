let { userLogin } = require("../../controllers/user/user_login");
let express = require("express");
let router = express.Router();
require("dotenv").config();

const passport = require("passport");
const jwt = require("jsonwebtoken");

// Login API
router.post("/user_login", userLogin);

// ✅ Step 1: Trigger Google OAuth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ Step 2: Handle Google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const { user, token, redirectPath } = req.user;
      console.log("google token------", token);

      // ✅ Set JWT token in cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: true, // only send over HTTPS
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      // res.redirect(`https://shadisite.com`);
      res.redirect(`http://localhost:5173`);

      // res.redirect(`https://localhost:7000/login-page`);
    } catch (error) {
      console.error("OAuth Callback Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// ✅ Test Page with Google Login Link
router.get("/login-page", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Login with Google</title>
      </head>
      <body>
        <h2>Login Using Google</h2>
        <a href="auth/google">Login with Google</a>
      </body>
    </html>
  `);
});

module.exports = router;
