import { readFileSync } from "fs";
import { resolve } from "path";
import nodemailer from "nodemailer";
import {
  getSmtpConfig,
  smtpAuthHint,
} from "../src/lib/email/smtp-config";
import { getBookingNotificationRecipients } from "../src/lib/email/recipients";

function loadEnv(): void {
  const envPath = resolve(process.cwd(), ".env");
  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnv();

  const config = getSmtpConfig();
  if (!config) {
    console.error("Missing SMTP env vars. Required:");
    console.error("  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM");
    process.exit(1);
  }

  const recipients = getBookingNotificationRecipients();
  if (!recipients.length) {
    console.error("No notification recipients. Set ADMIN_EMAIL and/or SMTP_USER.");
    process.exit(1);
  }

  console.log("SMTP configuration:");
  console.log(`  host: ${config.host}`);
  console.log(`  port: ${config.port}`);
  console.log(`  user: ${config.user}`);
  console.log(`  from: ${config.from}`);
  console.log(`  password length: ${config.pass.length} chars (spaces stripped)`);
  console.log(`  notify: ${recipients.join(", ")}`);

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    requireTLS: config.port === 587,
  });

  console.log("\n1/2 Verifying SMTP connection...");
  try {
    await transporter.verify();
    console.log("   SMTP connection OK");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("SMTP test failed:", message.split("\n")[0]);
    const hint = smtpAuthHint(message);
    if (hint) console.error("\n" + hint);
    console.error(
      "\nAlso confirm the app password was created while signed in as:",
      config.user
    );
    process.exit(1);
  }

  console.log(`\n2/2 Sending test email to ${recipients.join(", ")}...`);
  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: recipients,
      subject: "SierraLink SMTP test",
      html: `<p>SMTP test successful at ${new Date().toISOString()}.</p><p>Booking request emails are ready.</p>`,
    });
    console.log(`   Email sent — messageId: ${info.messageId}`);
    console.log("\nSMTP test passed.");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("SMTP test failed:", message);
    const hint = smtpAuthHint(message);
    if (hint) console.error("\n" + hint);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("SMTP test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
