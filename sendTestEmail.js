import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config();

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function sendTestEmail() {
  const params = {
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [process.env.TO_EMAIL],
    },
    Message: {
      Subject: { Data: "AWS SES Test Email (v3)" },
      Body: {
        Text: { Data: "Hello! This is a test email using AWS SDK v3." },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);
    console.log("Email sent:", response.MessageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

sendTestEmail();
