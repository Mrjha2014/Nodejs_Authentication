const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Path to your User model

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          isVerified: true,
          lastLogin: new Date(),
        };

        try {
          // Check for existing user
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // User exists, update last login
            user.lastLogin = new Date();
            await user.save();
            done(null, user); // Continue with the login process
          } else {
            // User doesn't exist, create a new one
            try {
              user = await User.create(newUser);
              done(null, user); // Continue with the login process
            } catch (error) {
              console.error("Error creating a new user:", error);
              done(error, null); // Handle the error appropriately
            }
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
