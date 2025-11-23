const mongoose = require("mongoose");

const LoanApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,

  monthlySalary: Number,
  existingLoans: Number,
  totalEMI: Number,
  loanAmountRequested: Number,
  employmentType: String,
  loanPurpose: String,
  tenureMonths: Number,

  // Document URLs (uploaded to Cloudinary)
  aadhaarUrl: String,
  panUrl: String,
  bankStatementUrl: String,
  salarySlipUrl: String,

  // AI Score
  creditScore: Number,
  eligibility: String,

  status: { type: String, default: "Pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoanApplication", LoanApplicationSchema);