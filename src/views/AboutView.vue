<template>
  <div class="about">
    <h1>About Our Library</h1>
    <p>
      Welcome to our digital library! We're dedicated to providing a vast collection of books
      and resources to our community.
    </p>

    <h2>📧 Contact Us via Email</h2>
    <form @submit.prevent="sendEmail" class="email-form">
      <input
        v-model="email"
        type="email"
        placeholder="Recipient Email"
        required
      />
      <textarea
        v-model="message"
        placeholder="Write your message..."
        required
      ></textarea>
      <button type="submit" :disabled="sending">
        {{ sending ? "Sending..." : "Send Email" }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      message: "",
      sending: false,
      // 允许发送的 Mailgun Sandbox 授权邮箱列表
      authorizedEmails: [
        "wangjun6666666633@gmail.com",
        "kche0224@student.monash.edu"
      ]
    };
  },
  methods: {
    async sendEmail() {
      if (!this.email || !this.message) return;

      // 🔒 检查邮箱是否在授权列表
      if (!this.authorizedEmails.includes(this.email)) {
        alert(`⚠️ The email "${this.email}" is not authorized in the Mailgun Sandbox.`);
        return;
      }

      this.sending = true;

      try {
        const response = await fetch("http://127.0.0.1:5001/week7-kaichen/us-central1/api/sendEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            message: this.message,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert("✅ Email sent successfully!");
          this.email = "";
          this.message = "";
        } else {
          alert(`❌ Failed to send email: ${result.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error sending email:", error);
        alert(`⚠️ An error occurred: ${error.message}`);
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
.about {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 30px;
}

input,
textarea {
  padding: 12px;
  font-size: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}
input:focus,
textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  outline: none;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

button {
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-weight: 600;
  transition: all 0.2s ease;
}
button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}
</style>

