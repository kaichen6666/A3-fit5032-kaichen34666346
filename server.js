// ===============================
// Import Required Modules
// ===============================
import "dotenv/config";
import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import Mailgun from "mailgun-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


// ===============================
// Setup __dirname
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// Initialize Firebase Admin SDK
// ===============================

// Read service account key JSON
const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf-8")
);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Test Firestore connection
(async () => {
  try {
    const snapshot = await db.collection("events").get();
    console.log("✅ Firestore connected, events count:", snapshot.size);
  } catch (err) {
    console.error("❌ Firestore connection failed:", err);
  }
})();

// ===============================
// Setup Express App
// ===============================
const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// Mailgun Configuration
// ===============================
// Mailgun configuration using environment variables
const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

// simple runtime check to help debugging
if (!apiKey || !domain) {
  console.error("❌ Mailgun config missing. Set MAILGUN_API_KEY and MAILGUN_DOMAIN in environment.");
  // optional: process.exit(1);
}

const mailgun = Mailgun({ apiKey, domain });


// Authorized email addresses (must be verified in Mailgun Sandbox)
const authorizedEmails = [
  "wangjun6666666633@gmail.com",
  "kche0224@student.monash.edu"
];

// ===============================
// POST /send-email
// Send an email via Mailgun
// ===============================
app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  // Validate fields
  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  // Check if email is authorized
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

  // Send email through Mailgun
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

// ===============================
// GET /api/events
// Get all events from Firestore
// ===============================
app.get("/api/events", async (req, res) => {
  try {
    const snapshot = await db.collection("events").get();
    const events = [];

    snapshot.forEach(doc => {
      console.log("📄 Firestore document:", doc.data());
      events.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, events });
  } catch (err) {
    console.error("❌ Firestore Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// GET /api/events/:email
// Get all events by a specific user
// ===============================
app.get("/api/events/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const snapshot = await db
      .collection("events")
      .where("createdBy", "==", email)
      .get();

    const events = [];
    snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));

    res.json({ success: true, events });
  } catch (err) {
    console.error("❌ Firestore Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// POST /events
// Add a new event to Firestore
// ===============================
app.post("/events", async (req, res) => {
  const { title, start, remindAt, createdBy, notes } = req.body;

  // Validate fields
  if (!title || !start || !remindAt || !createdBy) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
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

// ===============================
// Start Express Server
// ===============================
app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});
