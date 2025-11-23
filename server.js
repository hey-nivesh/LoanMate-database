require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in environment variables");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Replace with your frontend URL in production
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB Connection (without deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log(`📊 Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// Routes
const applyLoanRoutes = require("./routes/applyLoan");
const uploadDocumentsRoutes = require("./routes/uploadDocuments");

app.use("/api", applyLoanRoutes);
app.use("/api", uploadDocumentsRoutes);

// Additional test route
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for Render
app.get("/", (req, res) => {
  res.json({ 
    status: "Server is running",
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found"
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});