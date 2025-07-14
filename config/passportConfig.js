const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const User = require("../src/model/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://api-shadisite-com.onrender.com/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {

        // 🔍 Find user by email
        let user = await User.findOne({
          email: profile.emails[0].value,
        });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            pass: null,
            auth_key: null,
          });

          await user.save();
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        await User.findByIdAndUpdate(user._id, { auth_key: token });

        done(null, { user, token });
      } catch (error) {
        console.error("Passport Error:", error);
        done(error, null);
      }
    }
  )
);
