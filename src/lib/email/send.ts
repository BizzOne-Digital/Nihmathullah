import nodemailer from "nodemailer";
import { getSmtpConfig } from "@/lib/email/smtp-config";
import { isSmtpEnabled } from "@/lib/utils";

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

export interface SendEmailOptions {
  replyTo?: string;
}

function getTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  const { host, port, user, pass } = config;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    requireTLS: port === 587,
  });
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
  options?: SendEmailOptions
): Promise<SendEmailResult> {
  if (!isSmtpEnabled()) {
    return {
      success: false,
      error: "Email delivery is not configured",
    };
  }

  const transporter = getTransporter();
  const config = getSmtpConfig();
  const from = config?.from;
  const recipients = Array.isArray(to) ? to : [to];

  if (!transporter || !from || recipients.length === 0) {
    return {
      success: false,
      error: "Email delivery is not configured",
    };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to: recipients,
      replyTo: options?.replyTo,
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
