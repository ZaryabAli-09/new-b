const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/api/auth.routes.js");
const userRoutes = require("./routes/api/user.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cookieParser()); // Parse cookies from request headers
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // When credentials: true is set, it means that cookies will be included in cross-origin requests made by your frontend applicati

// Connect to MongoDB
async function dbConnection() {
  try {
    const conn = await mongoose.connect(process.env.mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Failed to connect to MongoDB");
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("api is working");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Wildcard route for handling 404 errors
app.get("*", (req, res) => {
  res.status(404).json("not found");
});

// catchError Middleware only for catch block
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    message,
  });
});

const port = process.env.PORT || 3000;

// Start the server and call MongoDB connection inside listen
app.listen(port, async () => {
  try {
    console.log(`Server running on port ${port}`);
    await dbConnection();
  } catch (error) {
    console.log(`Error starting server: ${error.message}`);
  }
});