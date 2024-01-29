const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const flash = require("connect-flash");

const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db"); 
require("dotenv").config();

// Connect to the Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret key",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport Config
require("./config/passport")(passport);
require("./config/socialAuth")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Set up View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", authRoutes);

// Catch-all for unmatched routes
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Set Port and Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
