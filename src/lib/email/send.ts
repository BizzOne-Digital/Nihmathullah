import nodemailer from "nodemailer";
import { isSmtpEnabled } from "@/lib/utils";

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  if (!isSmtpEnabled()) {
    return {
      success: false,
      error: "Email delivery is not configured",
    };
  }

  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM;

  if (!transporter || !from) {
    return {
      success: false,
      error: "Email delivery is not configured",
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    if (!info.messageId) {
      return {
        success: false,
        error: "Email was accepted by the server but no message ID was returned",
      };
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email delivery error";

    return {
      success: false,
      error: message,
    };
  }
}
