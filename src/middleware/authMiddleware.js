// Middleware function to check if the user is already logged in
const isAlreadyLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/dashboard"); // Redirect to the dashboard if the user is already logged in
  }
  next(); // Continue to the next middleware if the user is not logged in
};

// Middleware function to ensure that the user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // Continue to the next middleware if the user is authenticated
  }
  req.flash("error", "Please log in to view this resource"); // Flash an error message if the user is not authenticated
  res.redirect("/login"); // Redirect to the login page
};

module.exports = {
  isAlreadyLoggedIn, // Export the isAlreadyLoggedIn middleware function
  ensureAuthenticated, // Export the ensureAuthenticated middleware function
};
