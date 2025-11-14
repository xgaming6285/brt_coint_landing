const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    walletAddress: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    investmentAmount: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      trim: true,
    },
    acceptedTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    receiveUpdates: {
      type: Boolean,
      default: false,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    emailStatus: {
      firstContactSent: {
        type: Boolean,
        default: false,
      },
      firstContactDate: {
        type: Date,
      },
      reminderSent: {
        type: Boolean,
        default: false,
      },
      reminderDate: {
        type: Date,
      },
      lastEmailType: {
        type: String,
        enum: ["none", "first-contact", "reminder"],
        default: "none",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create index for email to prevent duplicates
registrationSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);
