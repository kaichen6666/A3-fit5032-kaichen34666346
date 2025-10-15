// server.js
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Configure AWS SES v2
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

// POST /send-email: send email with attachment
app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    const file = req.files?.file; // must match frontend input name="file"

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, subject, and message are required",
      });
    }

    // Construct raw MIME email
    const boundary = "NextPart_" + Date.now();
    const fromEmail = process.env.FROM_EMAIL;

    const rawLines = [];

    // Email headers
    rawLines.push(`From: ${fromEmail}`);
    rawLines.push(`To: ${to}`);
    rawLines.push(`Subject: ${subject}`);
    rawLines.push("MIME-Version: 1.0");
    rawLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    rawLines.push("");

    // Text part
    rawLines.push(`--${boundary}`);
    rawLines.push("Content-Type: text/plain; charset=UTF-8");
    rawLines.push("Content-Transfer-Encoding: 7bit");
    rawLines.push("");
    rawLines.push(message);
    rawLines.push("");

    // Attachment part
    if (file) {
      const fileBase64 = file.data.toString("base64");
      rawLines.push(`--${boundary}`);
      rawLines.push(`Content-Type: ${file.mimetype}; name="${file.name}"`);
      rawLines.push("Content-Transfer-Encoding: base64");
      rawLines.push(`Content-Disposition: attachment; filename="${file.name}"`);
      rawLines.push("");

      // Split base64 into 76-character lines for SES
      const chunkSize = 76;
      for (let i = 0; i < fileBase64.length; i += chunkSize) {
        rawLines.push(fileBase64.slice(i, i + chunkSize));
      }
      rawLines.push("");
    }

    rawLines.push(`--${boundary}--`);
    rawLines.push("");

    const params = {
      RawMessage: { Data: rawLines.join("\r\n") },
      Source: fromEmail,
    };

    const result = await ses.sendRawEmail(params).promise();
    res.json({ success: true, messageId: result.MessageId });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
