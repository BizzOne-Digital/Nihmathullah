import { sendEmail } from "@/lib/email/send";

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

export async function notifyAdminNewBooking(input: {
  reference: string;
  mode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  rideType: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupDate: string;
  pickupTime: string;
}): Promise<void> {
  const to = adminRecipient();
  if (!to) return;

  const lines = [
    `<p><strong>New ${input.mode} request</strong> — ${input.reference}</p>`,
    `<p><strong>Contact:</strong> ${input.contactName} · ${input.contactEmail} · ${input.contactPhone}</p>`,
    `<p><strong>Ride type:</strong> ${input.rideType}</p>`,
    `<p><strong>Pickup:</strong> ${input.pickupAddress} on ${input.pickupDate} at ${input.pickupTime}</p>`,
    `<p><strong>Destination:</strong> ${input.destinationAddress}</p>`,
    `<p><a href="${adminUrl("/admin/bookings")}">View in admin</a></p>`,
  ];

  await sendEmail(
    to,
    `New SierraLink ${input.mode}: ${input.reference}`,
    lines.join("\n")
  );
}
