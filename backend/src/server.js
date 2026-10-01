const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DIGITAL INDIA RES-Q Backend is running 🚨"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚨 RES-Q Backend running on http://localhost:${PORT}`);
});