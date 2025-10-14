import admin from "firebase-admin";

// 🔹 指定本地 Emulator host
// 🔹 指定 Firestore Emulator IPv4 地址
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

// 🔹 初始化 Admin SDK，并指定 projectId
admin.initializeApp({
  projectId: "week7-kaichen"  // 这里写你 Firebase 项目 ID
});

const db = admin.firestore();



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

// GET 所有预约事件
app.get("/api/events", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];
    snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));
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


