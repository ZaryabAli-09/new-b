const jwt = require("jsonwebtoken");
const User = require("../models/user.models.js"); // Assuming you have a User model

// Middleware to verify if the user is logged in and has a 'user' role
const verifyUser = async (req, res, next) => {
  try {
    // Get access token from cookies
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Decode the token and extract user info
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY); // Use your secret key here
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user role is 'user'
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to verify if the user has an 'admin' role
const verifyAdmin = async (req, res, next) => {
  try {
    // Get access token from cookies
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }

    // Decode the token and extract user info
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY); // Use your secret key here
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user role is 'admin'
    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Unauthorized Access! Only admin can access these route",
      });
    }

    // Attach the user to the request object for further use
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { verifyUser, verifyAdmin };
