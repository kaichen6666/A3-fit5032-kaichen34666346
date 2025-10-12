require("dotenv").config();

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const Mailgun = require("mailgun-js");

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = Mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
});

const app = express();
app.use(cors({ origin: true }));
app.use(express.json()); // 解析 JSON 请求

// ✅ 授权邮箱列表（必须在 Mailgun Sandbox 里授权过）
const authorizedEmails = [
  "wangjun6666666633@gmail.com",
  "kche0224@student.monash.edu"
];

function sendMailgunMessage(data) {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (err, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
}

// POST /sendEmail
app.post("/sendEmail", async (req, res) => {
  console.log("📩 /sendEmail hit", req.body);

  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Email and message are required." });
  }

  // 🔒 检查邮箱是否在授权列表
  if (!authorizedEmails.includes(email)) {
    return res.status(403).json({
      success: false,
      error: `The email "${email}" is not authorized in the Mailgun Sandbox.`
    });
  }

  const data = {
    from: `Mailgun Sandbox <postmaster@${MAILGUN_DOMAIN}>`,
    to: email,
    subject: "📚 Message from Firebase Library App",
    text: message,
  };

  try {
    const body = await sendMailgunMessage(data);
    return res.json({ success: true, body });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 全局 404
app.use((req, res) => res.status(404).json({ success: false, error: "Endpoint not found" }));

exports.api = functions.https.onRequest(app);
