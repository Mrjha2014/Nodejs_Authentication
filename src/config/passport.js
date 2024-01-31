// Import required modules
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");

// Configure passport authentication
module.exports = function (passport) {
  // Use LocalStrategy for authentication
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
            // User not found
            return done(null, false, {
              message: "That email is not registered",
            });
          }
          if (!user.password) {
            // User registered via Google and doesn't have a local password
            return done(null, false, {
              message: "Please log in with Google or reset your password.",
            });
          }

          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            // Passwords match, authentication successful
            return done(null, user);
          } else {
            // Passwords do not match
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (err) {
          // Error occurred during authentication
          return done(err);
        }
      }
    )
  );

  // Serialize and Deserialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // Find user by ID
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      // Error occurred during deserialization
      done(error, null);
    }
  });
};
