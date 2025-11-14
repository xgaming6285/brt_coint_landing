require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Registration = require("./models/Registration");
const {
  sendFirstContactEmail,
  sendReminderEmail,
  sendBatchEmails,
} = require("./services/emailService");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(__dirname));

// MongoDB Connection
const MONGO_URI =
  process.env.MONGO_DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    console.log("📊 Database: brt-token-registrations");
    console.log("📁 Collection: registrations");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes

// POST - Verify admin private key
app.post("/api/admin/verify", async (req, res) => {
  try {
    const { privateKey } = req.body;
    const correctKey = process.env.PRIVATE_KEY;

    if (!correctKey) {
      return res.status(500).json({
        success: false,
        message: "Private key not configured on server",
      });
    }

    if (privateKey === correctKey) {
      res.json({
        success: true,
        message: "Authentication successful",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid private key",
      });
    }
  } catch (error) {
    console.error("Auth verification error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during authentication",
    });
  }
});

// POST - Create new registration
app.post("/api/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      walletAddress,
      phoneNumber,
      country,
      investmentAmount,
      referralCode,
      acceptedTerms,
      receiveUpdates,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !walletAddress) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: fullName, email, and walletAddress",
      });
    }

    if (!acceptedTerms) {
      return res.status(400).json({
        success: false,
        message: "You must accept the terms and conditions",
      });
    }

    // Check if email already exists
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // Create new registration
    const registration = new Registration({
      fullName,
      email,
      walletAddress,
      phoneNumber,
      country,
      investmentAmount,
      referralCode,
      acceptedTerms,
      receiveUpdates,
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! We will contact you soon.",
      data: {
        id: registration._id,
        email: registration.email,
        registeredAt: registration.registeredAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// GET - Get all registrations (optional - for admin)
app.get("/api/registrations", async (req, res) => {
  try {
    const registrations = await Registration.find()
      .select("-__v")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    console.error("Fetch registrations error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching registrations",
    });
  }
});

// GET - Check if email is already registered
app.get("/api/check-email/:email", async (req, res) => {
  try {
    const registration = await Registration.findOne({
      email: req.params.email,
    });
    res.json({
      success: true,
      exists: !!registration,
    });
  } catch (error) {
    console.error("Check email error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while checking email",
    });
  }
});

// POST - Send email to a specific user
app.post("/api/send-email", async (req, res) => {
  try {
    const { userId, emailType } = req.body;

    if (!userId || !emailType) {
      return res.status(400).json({
        success: false,
        message: "userId and emailType are required",
      });
    }

    if (!["first-contact", "reminder"].includes(emailType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid emailType. Must be 'first-contact' or 'reminder'",
      });
    }

    // Find the user
    const user = await Registration.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send email based on type
    let result;
    if (emailType === "first-contact") {
      result = await sendFirstContactEmail(user);
      // Update email status
      user.emailStatus.firstContactSent = true;
      user.emailStatus.firstContactDate = new Date();
      user.emailStatus.lastEmailType = "first-contact";
    } else {
      result = await sendReminderEmail(user);
      // Update email status
      user.emailStatus.reminderSent = true;
      user.emailStatus.reminderDate = new Date();
      user.emailStatus.lastEmailType = "reminder";
    }

    await user.save();

    res.json({
      success: true,
      message: `${emailType} email sent successfully`,
      data: result,
    });
  } catch (error) {
    console.error("Send email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// POST - Send batch emails
app.post("/api/send-batch-emails", async (req, res) => {
  try {
    const { userIds, emailType } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "userIds array is required",
      });
    }

    if (!["first-contact", "reminder"].includes(emailType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid emailType. Must be 'first-contact' or 'reminder'",
      });
    }

    // Find all users
    const users = await Registration.find({ _id: { $in: userIds } });

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    // Send batch emails
    const results = await sendBatchEmails(users, emailType);

    // Update email status for successful sends
    for (const success of results.successful) {
      const user = users.find((u) => u.email === success.email);
      if (user) {
        if (emailType === "first-contact") {
          user.emailStatus.firstContactSent = true;
          user.emailStatus.firstContactDate = new Date();
          user.emailStatus.lastEmailType = "first-contact";
        } else {
          user.emailStatus.reminderSent = true;
          user.emailStatus.reminderDate = new Date();
          user.emailStatus.lastEmailType = "reminder";
        }
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Batch emails sent: ${results.successful.length} successful, ${results.failed.length} failed`,
      data: results,
    });
  } catch (error) {
    console.error("Batch email error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send batch emails",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Serve the index.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
