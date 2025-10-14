import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import Mailgun from "mailgun-js";

import fs from "fs";
import path from "path";
//import admin from "firebase-admin";
import { fileURLToPath } from "url";


// 获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取服务账号 JSON 文件
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf-8")
);

// 初始化 Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// 获取 Firestore 实例
const db = admin.firestore();


// 测试输出 Firestore collection
(async () => {
  try {
    const snapshot = await db.collection("events").get();
    console.log("✅ Firestore connected, events count:", snapshot.size);
  } catch (err) {
    console.error("❌ Firestore connection failed:", err);
  }
})();



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

// GET 所有预约事件
app.get("/api/events", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];
    snapshot.forEach(doc => {
      console.log("📄 Firestore document:", doc.data()); // ← 打印每条数据
      events.push({ id: doc.id, ...doc.data() });
    });
    res.json({ success: true, events });
  } catch (err) {
    console.error("❌ Firestore Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET 指定邮箱的预约事件
app.get("/api/events/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const snapshot = await db.collection("events").where("createdBy", "==", email).get();
    const events = [];
    snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));
    res.json({ success: true, events });
  } catch (err) {
    console.error("❌ Firestore Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});





app.post("/events", async (req, res) => {
  const { title, start, remindAt, createdBy, notes } = req.body;

  // 检查字段
  if (!title || !start || !remindAt || !createdBy) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  const newEvent = {
    title,
    start,
    remindAt,
    createdBy,
    notes: notes || ""
  };

  try {
    const docRef = await db.collection("events").add(newEvent);
    res.json({ success: true, id: docRef.id, event: newEvent });
  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// 启动服务器
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});


