const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.models.js");

router.post("/register", async (req, res, next) => {
  try {
    // validation
    console.log("hit");
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      services: 2,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.user_role },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "30d" } // Token valid for 1 hour
    );

    // Set token in cookies
    res.cookie("accessToken", token, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: true, // Ensures the cookie is sent over HTTPS in production
      sameSite: "None", // Ensures the cookie is sent only to same-site requests
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  // Clear the auth token cookie
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
