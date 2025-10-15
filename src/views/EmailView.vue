<template>
  <div class="email-container">
    <h2>Send Email with Attachment</h2>

    <label for="to">Recipient Email:</label>
    <input type="email" id="to" v-model="to" placeholder="Enter recipient email" />

    <label for="subject">Subject:</label>
    <input type="text" id="subject" v-model="subject" placeholder="Email subject" />

    <label for="message">Message:</label>
    <textarea id="message" v-model="message" rows="6" placeholder="Write your message here..."></textarea>

    <label for="file">Attachment:</label>
    <input type="file" id="file" @change="handleFile" />

    <button @click="sendEmail">Send Email</button>

    <p v-if="status" :class="{ success: isSuccess, error: !isSuccess }">{{ status }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const to = ref("");
const subject = ref("");
const message = ref("");
const file = ref(null);
const status = ref("");
const isSuccess = ref(false);

function handleFile(event) {
  file.value = event.target.files[0] || null;
}

async function sendEmail() {
  if (!to.value || !subject.value || !message.value) {
    status.value = "⚠️ Please provide recipient, subject, and message";
    isSuccess.value = false;
    return;
  }

  const formData = new FormData();
  formData.append("to", to.value);
  formData.append("subject", subject.value);
  formData.append("message", message.value);
  if (file.value) formData.append("attachment", file.value);

  try {
    status.value = "📤 Sending email...";
    const res = await axios.post("http://localhost:5000/send-email", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      status.value = `✅ Email sent! Message ID: ${res.data.messageId}`;
      isSuccess.value = true;
    } else {
      status.value = "❌ Failed to send email";
      isSuccess.value = false;
    }
  } catch (err) {
    console.error(err);
    status.value = "❌ Error sending email";
    isSuccess.value = false;
  }
}
</script>

<style scoped>
.email-container {
  max-width: 480px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
}
h2 { text-align: center; color: #333; margin-bottom: 20px; }
label { display: block; margin-top: 10px; font-weight: 600; }
input, textarea { width: 100%; padding: 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 5px; }
button { width: 100%; margin-top: 15px; padding: 10px 0; border: none; border-radius: 6px; background-color: #4a90e2; color: #fff; font-weight: bold; cursor: pointer; transition: 0.3s; }
button:hover { background-color: #357abd; }
.success { color: green; margin-top: 10px; text-align: center; }
.error { color: red; margin-top: 10px; text-align: center; }
</style>
