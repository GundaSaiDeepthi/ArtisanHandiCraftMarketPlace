import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function run() {
  try {
    console.log("Verifying transporter...");
    await transporter.verify();
    console.log("Transporter verification SUCCESSFUL!");
    
    console.log("Attempting to send test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMTP Test Email",
      text: "If you see this, email sending works!",
    });
    console.log("Email sent successfully! MessageId:", info.messageId);
  } catch (err) {
    console.error("Transporter verification FAILED:", err);
  }
  process.exit(0);
}

run();
