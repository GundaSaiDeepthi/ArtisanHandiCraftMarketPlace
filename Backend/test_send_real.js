import "dotenv/config";
import { sendOTPEmail } from "./utils/sendEmail.js";

async function run() {
  try {
    console.log("Using EMAIL_USER:", process.env.EMAIL_USER);
    console.log("Sending OTP verification email...");
    await sendOTPEmail(process.env.EMAIL_USER, "123456");
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Failed to send email. Detailed Error Stack:");
    console.error(err);
  }
  process.exit(0);
}

run();
