export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

/** Gmail app passwords are often pasted with spaces — strip them. */
export function normalizeSmtpPassword(password: string): string {
  return password.replace(/\s+/g, "");
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = normalizeSmtpPassword(process.env.SMTP_PASSWORD ?? "");
  const from = process.env.EMAIL_FROM?.trim();
  const port = Number(process.env.SMTP_PORT || 587);

  if (!host || !user || !pass || !from) {
    return null;
  }

  return { host, port, user, pass, from };
}

export function smtpAuthHint(errorMessage: string): string | null {
  const lower = errorMessage.toLowerCase();

  if (lower.includes("badcredentials") || lower.includes("username and password not accepted")) {
    return [
      "Gmail rejected the SMTP login.",
      "Fix:",
      "  1. Sign in to sierralink.bookings@gmail.com",
      "  2. Enable 2-Step Verification (Google Account → Security)",
      "  3. Create a new App Password: https://myaccount.google.com/apppasswords",
      "  4. Update SMTP_PASSWORD in .env (16 chars, no spaces)",
      "  5. Set SMTP_USER to the same Gmail address that owns the app password",
      "  6. Re-run: npm run test:smtp",
    ].join("\n");
  }

  if (lower.includes("self signed certificate") || lower.includes("certificate")) {
    return "TLS/certificate issue — confirm SMTP_PORT is 587 for Gmail STARTTLS.";
  }

  return null;
}
