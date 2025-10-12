// server.js
import express from "express";
import cors from "cors";
import Mailgun from "mailgun-js";

const app = express();
app.use(cors());
app.use(express.json());

// Mailgun 配置信息
const apiKey = "2a599128f11fe3914e9658d1d718ebfb-556e0aa9-e075245c";
const domain = "sandboxa48cd105f28c4f5e8930fa277d687237.mailgun.org";
const mailgun = Mailgun({ apiKey, domain });

// ✅ 授权邮箱列表（必须在 Mailgun Sandbox 里授权过）
const authorizedEmails = [
  "wangjun6666666633@gmail.com",
  "kche0224@student.monash.edu"
];

// 邮件接口
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  // 检查字段
  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  // 🔒 检查是否在授权列表
  if (!authorizedEmails.includes(email)) {
    return res.status(403).json({ 
      success: false, 
      error: `The email "${email}" is not authorized in the Mailgun Sandbox.` 
    });
  }

  const data = {
    from: `Mailgun Sandbox <postmaster@${domain}>`,
    to: email,
    subject: "Library Contact Message",
    text: message,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.error("❌ Mailgun Error:", error);
      res.status(500).json({ success: false, error: error.message });
    } else {
      console.log("✅ Email sent:", body);
      res.json({ success: true, body });
    }
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
