const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/emailUtil");
const passport = require("passport");
const authController = {};

authController.register = async (req, res) => {
  try {
    const { email, name, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/register");
    }

    let user = await User.findOne({ email });
    if (user) {
      req.flash("error", "Email already in use");
      return res.redirect("/register");
    }

    user = new User({ email, name, password });

    const emailToken = crypto.randomBytes(20).toString("hex");
    user.emailVerificationToken = crypto
      .createHash("sha256")
      .update(emailToken)
      .digest("hex");
    user.emailVerificationExpires = Date.now() + 3600000;

    await user.save();

    const verifyUrl = `http://${req.headers.host}/verify-email/${emailToken}`;
    const message = `Please click on the following link to verify your email: ${verifyUrl}`;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    req.flash(
      "success",
      "User registered successfully. Please verify your email."
    );
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "Error in registration");
    res.redirect("/register");
  }
};

authController.verifyEmail = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Token is invalid or has expired");
      return res.redirect("/login");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Email verified successfully");
      res.redirect("/dashboard");
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred during email verification");
    res.redirect("/login");
  }
};
authController.login = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      console.error("Login error:", err);
      req.flash("error", "Login error");
      return next(err);
    }
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/login");
    }
    req.login(user, async (err) => {
      if (err) {
        console.error("Error in req.login:", err);
        req.flash("error", "Error in login process");
        return next(err);
      }

      // Update lastLogin date
      user.lastLogin = Date.now();
      await user.save();

      req.flash("success", "Successfully logged in");
      res.redirect("/dashboard");
    });
  })(req, res, next);
};

authController.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle the error as needed
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/login");
  });
};
authController.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "User not found");
    return res.redirect("/forgot-password");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpires = Date.now() + 3600000;

  await user.save();

  const resetUrl = `http://${req.headers.host}/reset-password/${resetToken}`;
  const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    req.flash(
      "success",
      "An email has been sent with password reset instructions"
    );
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    req.flash("error", "Email could not be sent");
    res.redirect("/forgot-password");
  }
};

authController.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Token is invalid or has expired");
    return res.redirect("/reset-password");
  }

  // Check if passwords match
  if (req.body.password !== req.body.confirm_password) {
    req.flash("error", "Passwords do not match");
    return res.redirect("back"); // Redirect back to the password reset page
  }

  // Update password and clear reset token and expiry
  user.password = req.body.password; // Ensure your User model hashes the password before saving
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  req.flash("success", "Your password has been reset successfully");
  res.redirect("/login");
};

module.exports = authController;
