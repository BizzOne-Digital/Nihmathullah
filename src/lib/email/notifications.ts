import { sendEmail } from "@/lib/email/send";
import {
  formatReplyTo,
  getAdminNotificationRecipients,
  getBusinessReplyEmail,
} from "@/lib/email/recipients";
import {
  buildBookingConfirmationEmail,
  buildBookingRequestAdminEmail,
  buildCustomerFormConfirmationEmail,
  buildInquiryAdminEmail,
  type BookingRequestDetails,
  type InquiryEmailDetails,
} from "@/lib/email/templates";
import { getSiteSettings } from "@/lib/repositories/site-settings";
import { toSiteSettingsData } from "@/lib/site-settings";

function adminUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function loadSiteSettings() {
  try {
    const siteSettings = await getSiteSettings();
    if (siteSettings) {
      return toSiteSettingsData(siteSettings);
    }
  } catch {
    // Use template defaults when settings are unavailable
  }
  return undefined;
}

export async function notifyAdminNewInquiry(
  input: InquiryEmailDetails & { formLabel?: string }
): Promise<void> {
  const recipients = getAdminNotificationRecipients();
  if (!recipients.length) return;

  const formLabel =
    input.formLabel ||
    (input.inquiryType === "quote" ? "Quote request" : "Inquiry");

  const { subject, html } = buildInquiryAdminEmail({
    ...input,
    formLabel,
    adminUrl: adminUrl("/admin/inquiries"),
  });

  const replyTo = formatReplyTo(input.name, input.email);

  const result = await sendEmail(recipients, subject, html, { replyTo });
  if (!result.success) {
    console.error("[email] Admin inquiry notification failed:", result.error);
  }
}

export async function notifyCustomerInquiryConfirmation(
  input: InquiryEmailDetails & { formLabel?: string }
): Promise<void> {
  const to = input.email?.trim();
  if (!to || !input.name) return;

  const settings = await loadSiteSettings();
  const formLabel =
    input.formLabel ||
    (input.inquiryType === "quote" ? "quote request" : "inquiry");

  const summaryParts = [
    input.pickup ? `Pickup: ${input.pickup}` : "",
    input.destination ? `Destination: ${input.destination}` : "",
    input.preferredDateTime ? `When: ${input.preferredDateTime}` : "",
    input.message ? `Message: ${input.message}` : "",
  ].filter(Boolean);

  const { subject, html } = buildCustomerFormConfirmationEmail({
    name: input.name,
    formLabel,
    summary: summaryParts.join(" · ") || undefined,
    settings,
  });

  const replyTo = getBusinessReplyEmail(settings?.primaryEmail);

  const result = await sendEmail(to, subject, html, { replyTo });
  if (!result.success) {
    console.error("[email] Customer inquiry confirmation failed:", result.error);
  }
}

export async function notifyCustomerContactConfirmation(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const to = input.email?.trim();
  if (!to || !input.name) return;

  const settings = await loadSiteSettings();

  const { subject, html } = buildCustomerFormConfirmationEmail({
    name: input.name,
    formLabel: "message",
    summary: input.message ? `Your message: ${input.message.slice(0, 280)}` : undefined,
    settings,
  });

  const replyTo = getBusinessReplyEmail(settings?.primaryEmail);

  const result = await sendEmail(to, subject, html, { replyTo });
  if (!result.success) {
    console.error("[email] Customer contact confirmation failed:", result.error);
  }
}

export async function notifyAdminNewBooking(
  input: BookingRequestDetails
): Promise<void> {
  const recipients = getAdminNotificationRecipients();
  if (!recipients.length) return;

  const { subject, html } = buildBookingRequestAdminEmail({
    ...input,
    adminUrl: adminUrl("/admin/bookings"),
  });

  const replyTo = formatReplyTo(input.contactName, input.contactEmail);

  const result = await sendEmail(recipients, subject, html, { replyTo });
  if (!result.success) {
    console.error("[email] Admin booking notification failed:", result.error);
  }
}

export async function notifyCustomerBookingConfirmation(
  input: BookingRequestDetails
): Promise<void> {
  if (!input.contactName || !input.reference) return;

  const to = input.contactEmail?.trim();
  if (!to) return;

  const settings = await loadSiteSettings();

  const { subject, html } = buildBookingConfirmationEmail({
    ...input,
    settings,
  });

  const replyTo = getBusinessReplyEmail(settings?.primaryEmail);

  const result = await sendEmail(to, subject, html, { replyTo });
  if (!result.success) {
    console.error("[email] Customer booking confirmation failed:", result.error);
  }
}
