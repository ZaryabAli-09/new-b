const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/api/auth.routes.js");
const userRoutes = require("./routes/api/user.routes.js");
const orderLabelRoutes = require("./routes/api/orderLabel.routes.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();
const app = express();

// Built-in Middlewares
app.use(express.json()); // Parsing JSON bodies
app.use(helmet()); // Security headers
app.use(cookieParser()); // Parse cookies from request headers
app.use(compression()); // Compress response bodies

// built in middlewares
const allowedOrigins = [
  "https://icarusships.netlify.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Connect to MongoDB
async function dbConnection() {
  try {
    const conn = await mongoose.connect(process.env.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
app.use("/api/order-label", orderLabelRoutes);

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
