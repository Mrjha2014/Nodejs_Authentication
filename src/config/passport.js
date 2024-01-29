const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const passport = require("passport");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });
          if (!user) {
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

          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        } catch (err) {
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
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};