const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const {
  isAlreadyLoggedIn,
  ensureAuthenticated,
} = require("../middleware/authMiddleware");
const router = express.Router();

// Verify email route
router.get("/verify-email/:token", authController.verifyEmail);

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

// Logout route
router.get("/logout", authController.logout);

// Forgot Password route
router.post("/forgot-password", authController.forgotPassword);

// Reset Password route
router.post("/reset-password/:token", authController.resetPassword);

// Forgot Password page
router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", {
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
});

// Reset Password page
router.get("/reset-password/:token", (req, res) => {
  const token = req.params.token;
  res.render("reset-password", {
    token,
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
});

// GET login page
router.get("/login", isAlreadyLoggedIn, (req, res) => {
  res.render("login", {
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
});

// Google Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Auth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", failureFlash: true }),
  (req, res) => {
    // Successful authentication
    req.flash("success", "You have successfully logged in with Google!");
    res.redirect("/dashboard");
  }
);

// Register page
router.get("/register", isAlreadyLoggedIn, (req, res) => {
  res.render("register", {
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
});

// Dashboard route
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user, // Include the user object
    errorMessages: req.flash("error"),
    successMessages: req.flash("success"),
  });
});

module.exports = router;
