import { sendEmail } from "@/lib/email/send";
import {
  formatReplyTo,
  getBookingNotificationRecipients,
} from "@/lib/email/recipients";
import {
  buildBookingConfirmationEmail,
  buildBookingRequestAdminEmail,
  type BookingRequestDetails,
} from "@/lib/email/templates";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { toSiteSettingsData } from "@/lib/site-settings";

function adminRecipient(): string | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  return email || null;
}

function adminUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function notifyAdminNewInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message?: string;
  pickup?: string;
  destination?: string;
  preferredDateTime?: string;
}): Promise<void> {
  const to = adminRecipient();
  if (!to) return;

  const lines = [
    `<p><strong>New inquiry</strong> from ${input.name}</p>`,
    `<p><strong>Email:</strong> ${input.email}</p>`,
    input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : "",
    `<p><strong>Type:</strong> ${input.inquiryType}</p>`,
    input.pickup ? `<p><strong>Pickup:</strong> ${input.pickup}</p>` : "",
    input.destination ? `<p><strong>Destination:</strong> ${input.destination}</p>` : "",
    input.preferredDateTime
      ? `<p><strong>Preferred date/time:</strong> ${input.preferredDateTime}</p>`
      : "",
    input.message ? `<p><strong>Message:</strong><br/>${input.message.replace(/\n/g, "<br/>")}</p>` : "",
    `<p><a href="${adminUrl("/admin/inquiries")}">View in admin</a></p>`,
  ].filter(Boolean);

  await sendEmail(
    to,
    `New SierraLink inquiry from ${input.name}`,
    lines.join("\n")
  );
}

export async function notifyAdminNewBooking(
  input: BookingRequestDetails
): Promise<void> {
  const recipients = getBookingNotificationRecipients();
  if (!recipients.length) return;

  const { subject, html } = buildBookingRequestAdminEmail({
    ...input,
    adminUrl: adminUrl("/admin/bookings"),
  });

  const replyTo = formatReplyTo(input.contactName, input.contactEmail);

  await sendEmail(recipients, subject, html, { replyTo });
}

export async function notifyCustomerBookingConfirmation(
  input: BookingRequestDetails
): Promise<void> {
  if (!input.contactName || !input.reference) return;

  const to = input.contactEmail?.trim();
  if (!to) return;

  let settings;
  try {
    const siteSettings = await getSiteSettings();
    if (siteSettings) {
      settings = toSiteSettingsData(siteSettings);
    }
  } catch {
    // Use template defaults when settings are unavailable
  }

  const { subject, html } = buildBookingConfirmationEmail({
    ...input,
    settings,
  });

  await sendEmail(to, subject, html);
}
