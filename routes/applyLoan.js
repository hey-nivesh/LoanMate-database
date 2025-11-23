const express = require("express");
const LoanApplication = require("../models/LoanApplication");

const router = express.Router();

// POST route for loan application
router.post("/apply-loan", async (req, res) => {
  try {
    console.log("📩 Received loan application:", req.body);

    // Validate required fields
    const { fullName, email, phone, monthlySalary, loanAmountRequested } = req.body;
    
    if (!fullName || !email || !phone || !monthlySalary || !loanAmountRequested) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Create loan application in MongoDB
    const application = await LoanApplication.create(req.body);

    console.log("✅ Loan application saved:", application._id);

    res.json({
      success: true,
      message: "Loan application submitted successfully!",
      application: {
        id: application._id,
        fullName: application.fullName,
        email: application.email,
        loanAmountRequested: application.loanAmountRequested,
        status: application.status,
        createdAt: application.createdAt
      }
    });

  } catch (err) {
    console.error("❌ Error saving loan application:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
});

// GET route to fetch all loan applications (optional - for testing)
router.get("/applications", async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 }).limit(10);
    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET route to fetch single application by ID
router.get("/application/:id", async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: "Application not found"
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;