/** Normalize and dedupe email addresses (case-insensitive). */
export function uniqueEmails(addresses: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const address of addresses) {
    const trimmed = address?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

/**
 * Booking request alerts go to the business inbox plus the dedicated Gmail
 * SMTP account as a backup (when they differ).
 */
export function getBookingNotificationRecipients(): string[] {
  return uniqueEmails([
    process.env.ADMIN_EMAIL,
    process.env.SMTP_USER,
  ]);
}

export function formatReplyTo(name: string, email: string): string {
  const safeName = name.trim().replace(/"/g, "'");
  const safeEmail = email.trim();
  if (!safeEmail) return "";
  if (!safeName) return safeEmail;
  return `"${safeName}" <${safeEmail}>`;
}
