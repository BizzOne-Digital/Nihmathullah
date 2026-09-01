import type { SiteSettingsData } from "@/types";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings";

export interface BookingRequestDetails {
  reference: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  rideType: string;
  tripStructure: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  pickupTime: string;
  passengerCount: number;
  luggageCount: number;
  vehiclePreference?: string;
  airportCode?: string;
  flightType?: string;
  airline?: string;
  flightNumber?: string;
  specialInstructions?: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatRideType(value: string): string {
  const labels: Record<string, string> = {
    airport: "Airport Transfer",
    local: "Local Ride",
    "long-distance": "Long Distance",
    executive: "Executive",
    corporate: "Corporate",
    "private-car": "Private Car Service",
    hourly: "Hourly / As Directed",
  };
  return labels[value] || value;
}

function formatTripStructure(value: string): string {
  const labels: Record<string, string> = {
    "one-way": "One way",
    "round-trip": "Round trip",
    hourly: "By the hour",
  };
  return labels[value] || value;
}

function formatFlightType(value?: string): string {
  if (!value) return "";
  return value === "arrival" ? "Arrival" : value === "departure" ? "Departure" : value;
}

function emailLayout(
  body: string,
  settings: Pick<
    SiteSettingsData,
    | "businessName"
    | "primaryPhoneDisplay"
    | "alternatePhoneDisplay"
    | "primaryEmail"
  >
): string {
  const businessName = escapeHtml(settings.businessName);
  const phoneLine = [
    settings.primaryPhoneDisplay
      ? `<strong>${escapeHtml(settings.primaryPhoneDisplay)}</strong>`
      : "",
    settings.alternatePhoneDisplay
      ? escapeHtml(settings.alternatePhoneDisplay)
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${businessName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #d4c4a0;">
          <tr>
            <td style="padding:28px 32px 12px;border-bottom:3px solid #b8860b;">
              <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#8b7355;">${businessName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:15px;line-height:1.65;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #ece5d8;font-size:13px;line-height:1.6;color:#5c5348;">
              <p style="margin:0 0 8px;">Questions? Call us at ${phoneLine}.</p>
              ${
                settings.primaryEmail
                  ? `<p style="margin:0;">Email: <a href="mailto:${escapeHtml(settings.primaryEmail)}" style="color:#8b6914;">${escapeHtml(settings.primaryEmail)}</a></p>`
                  : ""
              }
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildDetailRows(
  input: BookingRequestDetails
): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Reference", input.reference],
    ["Service type", formatRideType(input.rideType)],
    ["Trip", formatTripStructure(input.tripStructure)],
    [
      "Pickup",
      `${input.pickupAddress} — ${input.pickupDate} at ${input.pickupTime}`,
    ],
    ["Destination", input.destinationAddress],
    ["Vehicle", input.vehiclePreference || "No preference"],
    ["Passengers", String(input.passengerCount)],
    ["Luggage", String(input.luggageCount)],
    ["Name", input.contactName],
    ["Phone", input.contactPhone],
    ["Email", input.contactEmail],
  ];

  const flightParts = [
    input.airportCode ? `Airport: ${input.airportCode}` : "",
    input.flightType ? formatFlightType(input.flightType) : "",
    input.airline ? `Airline: ${input.airline}` : "",
    input.flightNumber ? `Flight: ${input.flightNumber}` : "",
  ].filter(Boolean);

  if (flightParts.length) {
    rows.push(["Flight details", flightParts.join(" · ")]);
  }

  if (input.specialInstructions?.trim()) {
    rows.push(["Notes", input.specialInstructions.trim()]);
  }

  return rows;
}

function detailsTableHtml(rows: Array<[string, string]>): string {
  return rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;vertical-align:top;width:120px;font-size:13px;color:#8b7355;text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;font-size:15px;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

export interface BookingConfirmationEmailInput extends BookingRequestDetails {
  settings?: Partial<SiteSettingsData>;
}

export function buildBookingConfirmationEmail(
  input: BookingConfirmationEmailInput
): { subject: string; html: string } {
  const settings = {
    ...DEFAULT_SITE_SETTINGS,
    ...input.settings,
  };

  const subject = `Your SierraLink booking request — ${input.reference}`;

  const confirmationText =
    settings.bookingConfirmationText ||
    DEFAULT_SITE_SETTINGS.bookingConfirmationText ||
    "A SierraLink representative will contact you by email or phone to confirm availability, pricing, and payment.";

  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(input.contactName)},</p>
    <p style="margin:0 0 12px;">Thank you for submitting your <strong>booking request</strong> with SierraLink.</p>
    <p style="margin:0 0 20px;color:#5c5348;">This is <strong>not</strong> a confirmed reservation or paid booking. We have received your request and will review trip details shortly.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      ${detailsTableHtml(buildDetailRows(input))}
    </table>
    <p style="margin:0;padding:16px;background:#faf7f0;border-left:3px solid #b8860b;font-size:14px;line-height:1.6;">
      ${escapeHtml(confirmationText)}
    </p>
  `;

  return {
    subject,
    html: emailLayout(body, settings),
  };
}

export function buildBookingRequestAdminEmail(
  input: BookingRequestDetails & { adminUrl: string }
): { subject: string; html: string } {
  const settings = DEFAULT_SITE_SETTINGS;
  const subject = `New booking request — ${input.reference}`;

  const body = `
    <p style="margin:0 0 16px;"><strong>New booking request</strong> — ${escapeHtml(input.reference)}</p>
    <p style="margin:0 0 20px;color:#5c5348;">Review availability, send pricing, and follow up by email or phone. <strong>Reply to this email to reach the customer directly.</strong></p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      ${detailsTableHtml(buildDetailRows(input))}
    </table>
    <p style="margin:0;"><a href="${escapeHtml(input.adminUrl)}" style="color:#8b6914;">View in admin</a></p>
  `;

  return {
    subject,
    html: emailLayout(body, settings),
  };
}

export interface InquiryEmailDetails {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message?: string;
  pickup?: string;
  destination?: string;
  preferredDateTime?: string;
}

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  general: "General inquiry",
  quote: "Quote request",
  booking: "Booking question",
  corporate: "Corporate / executive",
  feedback: "Feedback",
  other: "Other",
};

function formatInquiryType(value: string): string {
  return INQUIRY_TYPE_LABELS[value] || value;
}

function buildInquiryRows(input: InquiryEmailDetails): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
  ];

  if (input.phone?.trim()) rows.push(["Phone", input.phone.trim()]);
  rows.push(["Type", formatInquiryType(input.inquiryType)]);
  if (input.pickup?.trim()) rows.push(["Pickup", input.pickup.trim()]);
  if (input.destination?.trim()) rows.push(["Destination", input.destination.trim()]);
  if (input.preferredDateTime?.trim()) {
    rows.push(["Preferred date/time", input.preferredDateTime.trim()]);
  }
  if (input.message?.trim()) rows.push(["Message", input.message.trim()]);

  return rows;
}

export function buildInquiryAdminEmail(
  input: InquiryEmailDetails & { adminUrl: string; formLabel: string }
): { subject: string; html: string } {
  const settings = DEFAULT_SITE_SETTINGS;
  const subject = `New ${input.formLabel.toLowerCase()} from ${input.name}`;

  const body = `
    <p style="margin:0 0 16px;"><strong>New ${escapeHtml(input.formLabel.toLowerCase())}</strong> from ${escapeHtml(input.name)}</p>
    <p style="margin:0 0 20px;color:#5c5348;"><strong>Reply to this email to reach the customer directly.</strong></p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
      ${detailsTableHtml(buildInquiryRows(input))}
    </table>
    <p style="margin:0;"><a href="${escapeHtml(input.adminUrl)}" style="color:#8b6914;">View in admin</a></p>
  `;

  return {
    subject,
    html: emailLayout(body, settings),
  };
}

export function buildCustomerFormConfirmationEmail(input: {
  name: string;
  formLabel: string;
  summary?: string;
  settings?: Partial<SiteSettingsData>;
}): { subject: string; html: string } {
  const settings = {
    ...DEFAULT_SITE_SETTINGS,
    ...input.settings,
  };

  const subject = `We received your ${input.formLabel.toLowerCase()} — SierraLink`;

  const body = `
    <p style="margin:0 0 16px;">Dear ${escapeHtml(input.name)},</p>
    <p style="margin:0 0 12px;">Thank you for contacting <strong>SierraLink Executive Transportation</strong>.</p>
    <p style="margin:0 0 20px;color:#5c5348;">We received your ${escapeHtml(input.formLabel.toLowerCase())} and a team member will respond by email or phone as soon as possible.</p>
    ${
      input.summary
        ? `<p style="margin:0;padding:16px;background:#faf7f0;border-left:3px solid #b8860b;font-size:14px;line-height:1.6;">${escapeHtml(input.summary)}</p>`
        : ""
    }
    <p style="margin:20px 0 0;font-size:14px;color:#5c5348;">You can reply to this email if you need to add more details.</p>
  `;

  return {
    subject,
    html: emailLayout(body, settings),
  };
}
