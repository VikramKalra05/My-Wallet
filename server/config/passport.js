const passport = require("passport");
const { UserModel } = require("../models/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: 'http://my-wallet-gamma-eight.vercel.app/auth/google/callback',
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Code to handle user authentication and retrieval
      try {
        // Check if user already exists in DB
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          // If user not found, create a new user
          user = new UserModel({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          });

          await user.save(); // Save to database
        } else {
          // If user exists, update their details (in case they changed their Google profile)
          user.name = profile.displayName;
          user.photo = profile.photos[0].value;
          await user.save();
        }

        return done(null, user); // Pass user to serializeUser
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user into session (store only user ID)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session (fetch full user details)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
