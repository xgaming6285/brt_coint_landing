const nodemailer = require("nodemailer");
const fs = require("fs").promises;
const path = require("path");

// Email configuration
const EMAIL_CONFIG = {
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_SMTP,
  },
};

// Create reusable transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email service is ready to send emails");
  }
});

/**
 * Load and populate email template
 * @param {string} templateName - Name of the template file (without extension)
 * @param {object} data - Data to populate in the template
 * @returns {Promise<string>} - Populated HTML template
 */
async function loadEmailTemplate(templateName, data) {
  try {
    // Go up one directory from services/ to project root, then into email-templates/
    const templatePath = path.join(
      __dirname,
      "..",
      "email-templates",
      `${templateName}.html`
    );
    let htmlContent = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders with actual data
    Object.keys(data).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(placeholder, data[key] || "-");
    });

    return htmlContent;
  } catch (error) {
    console.error("Error loading email template:", error);
    throw new Error("Failed to load email template");
  }
}

/**
 * Send first contact email to a user
 * @param {object} userData - User data from registration
 * @returns {Promise<object>} - Email send result
 */
async function sendFirstContactEmail(userData) {
  try {
    const { fullName, email, walletAddress, registeredAt } = userData;

    const templateData = {
      fullName: fullName,
      email: email,
      walletAddress: walletAddress,
      registrationDate: new Date(registeredAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const htmlContent = await loadEmailTemplate("first-contact", templateData);

    const mailOptions = {
      from: {
        name: "BPR Token Team",
        address: EMAIL_CONFIG.auth.user,
      },
      to: email,
      subject: "🚀 Welcome to BPR Token Pre-Sale!",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ First contact email sent to:", email);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      recipient: email,
    };
  } catch (error) {
    console.error("❌ Error sending first contact email:", error);
    throw error;
  }
}

/**
 * Send reminder email to a user
 * @param {object} userData - User data from registration
 * @returns {Promise<object>} - Email send result
 */
async function sendReminderEmail(userData) {
  try {
    const { fullName, email, walletAddress } = userData;

    const templateData = {
      fullName: fullName,
      email: email,
      walletAddress: walletAddress,
    };

    const htmlContent = await loadEmailTemplate("reminder", templateData);

    const mailOptions = {
      from: {
        name: "BPR Token Team",
        address: EMAIL_CONFIG.auth.user,
      },
      to: email,
      subject: "⏰ Don't Miss Out - BPR Token Pre-Sale Reminder",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Reminder email sent to:", email);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
      recipient: email,
    };
  } catch (error) {
    console.error("❌ Error sending reminder email:", error);
    throw error;
  }
}

/**
 * Send batch emails (with delay to avoid rate limits)
 * @param {array} users - Array of user data objects
 * @param {string} emailType - Type of email ('first-contact' or 'reminder')
 * @returns {Promise<object>} - Batch send results
 */
async function sendBatchEmails(users, emailType) {
  const results = {
    successful: [],
    failed: [],
  };

  for (let i = 0; i < users.length; i++) {
    try {
      const user = users[i];
      let result;

      if (emailType === "first-contact") {
        result = await sendFirstContactEmail(user);
      } else if (emailType === "reminder") {
        result = await sendReminderEmail(user);
      } else {
        throw new Error("Invalid email type");
      }

      results.successful.push({
        email: user.email,
        messageId: result.messageId,
      });

      // Add delay between emails to avoid rate limiting (1 second)
      if (i < users.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      results.failed.push({
        email: users[i].email,
        error: error.message,
      });
    }
  }

  return results;
}

module.exports = {
  sendFirstContactEmail,
  sendReminderEmail,
  sendBatchEmails,
};
