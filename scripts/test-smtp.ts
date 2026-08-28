import { readFileSync } from "fs";
import { resolve } from "path";
import nodemailer from "nodemailer";

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

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.EMAIL_FROM;
  const to = process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !from || !to) {
    console.error("Missing SMTP env vars. Check .env");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    requireTLS: port === 587,
  });

  console.log("1/2 Verifying SMTP connection...");
  await transporter.verify();
  console.log("   SMTP connection OK");

  console.log(`2/2 Sending test email to ${to}...`);
  const info = await transporter.sendMail({
    from,
    to,
    subject: "SierraLink SMTP test",
    html: `<p>SMTP test successful at ${new Date().toISOString()}.</p><p>Booking confirmation emails are ready.</p>`,
  });

  console.log(`   Email sent — messageId: ${info.messageId}`);
  console.log("SMTP test passed.");
}

main().catch((error) => {
  console.error("SMTP test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
