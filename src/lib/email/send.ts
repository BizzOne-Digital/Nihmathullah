import nodemailer from "nodemailer";
import { htmlToPlainText } from "@/lib/email/html-to-text";
import { getSmtpConfig } from "@/lib/email/smtp-config";
import { isSmtpEnabled } from "@/lib/utils";

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

export interface SendEmailOptions {
  replyTo?: string;
  text?: string;
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
  const recipients = Array.isArray(to) ? to : [to];

  if (!isSmtpEnabled()) {
    console.error("[email] SMTP not configured — email not sent", {
      to: recipients,
      subject,
    });
    return {
      success: false,
      error: "Email delivery is not configured",
    };
  }

  const transporter = getTransporter();
  const config = getSmtpConfig();
  const from = config?.from;
  const plainText = options?.text ?? htmlToPlainText(html);

  if (!transporter || !from || recipients.length === 0) {
    console.error("[email] SMTP transport unavailable — email not sent", {
      to: recipients,
      subject,
      hasTransporter: Boolean(transporter),
      hasFrom: Boolean(from),
    });
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
      text: plainText,
      html,
      priority: "normal",
      headers: {
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "normal",
      },
    });

    if (!info.messageId) {
      console.error("[email] No message ID returned", { to: recipients, subject });
      return {
        success: false,
        error: "Email was accepted by the server but no message ID was returned",
      };
    }

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown email delivery error";

    console.error("[email] Send failed", {
      to: recipients,
      subject,
      error: message,
    });
    return {
      success: false,
      error: message,
    };
  }
}
