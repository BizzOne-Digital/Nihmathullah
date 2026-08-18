import Stripe from "stripe";
import connectDB from "@/lib/db/connect";
import { getBaseUrl } from "@/lib/utils";
import { Quote } from "@/models";
import { getPricingSettings } from "@/lib/repositories/pricing-settings";
import {
  createPaymentRecord,
  getPaymentBySessionId,
  updatePaymentStatus,
} from "@/lib/repositories/payments";
import { updateBooking } from "@/lib/repositories/bookings";
import { isQuotePayable, updateQuoteStatus } from "@/lib/repositories/quotes";
import { RepositoryError } from "@/lib/repositories/errors";

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey);
}

function assertStripeConfigured(): Stripe {
  const stripe = getStripeClient();
  if (!stripe) {
    throw new RepositoryError(
      "Stripe is not configured. Set STRIPE_SECRET_KEY.",
      "CONFIGURATION"
    );
  }
  return stripe;
}

export type CheckoutSessionResult = {
  sessionId: string;
  url: string;
  paymentRecordId: string;
};

export async function createCheckoutSession(
  quoteId: string,
  options?: { quoteToken?: string }
): Promise<CheckoutSessionResult> {
  const stripe = assertStripeConfigured();

  await connectDB();

  const quote = await Quote.findById(quoteId);
  if (!quote) {
    throw new RepositoryError("Quote not found", "NOT_FOUND");
  }

  if (!isQuotePayable(quote)) {
    throw new RepositoryError(
      "Quote is not available for payment",
      "VALIDATION"
    );
  }

  const pricing = await getPricingSettings();
  if (!pricing?.paymentEnabled) {
    throw new RepositoryError("Payments are disabled", "VALIDATION");
  }

  const amount = quote.depositAmount > 0 ? quote.depositAmount : quote.total;
  if (amount <= 0) {
    throw new RepositoryError("Quote amount must be greater than zero", "VALIDATION");
  }

  const currency = pricing.currency.toLowerCase();
  const baseUrl = getBaseUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: amount,
          product_data: {
            name: `SierraLink Quote ${quote.reference}`,
            description:
              quote.depositAmount > 0 && quote.depositAmount < quote.total
                ? "Deposit payment"
                : "Transportation quote payment",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      quoteId: quote._id.toString(),
      bookingId: quote.bookingId.toString(),
      quoteReference: quote.reference,
    },
    success_url: `${baseUrl}/booking/payment-success?session_id={CHECKOUT_SESSION_ID}&reference=${quote.reference}`,
    cancel_url: options?.quoteToken
      ? `${baseUrl}/booking/quote/${encodeURIComponent(options.quoteToken)}?payment=cancelled`
      : `${baseUrl}/contact`,
  });

  if (!session.url) {
    throw new RepositoryError("Failed to create Stripe checkout session", "DATABASE");
  }

  const payment = await createPaymentRecord({
    quoteId: quote._id.toString(),
    bookingId: quote.bookingId.toString(),
    amount,
    currency: pricing.currency,
    status: "Pending",
    providerSessionId: session.id,
    providerPaymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
  });

  return {
    sessionId: session.id,
    url: session.url,
    paymentRecordId: payment._id.toString(),
  };
}

export type StripeWebhookResult = {
  received: true;
  duplicate?: boolean;
  eventType: string;
};

export async function handleStripeWebhook(
  rawBody: string | Buffer,
  signature: string
): Promise<StripeWebhookResult> {
  const stripe = assertStripeConfigured();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new RepositoryError(
      "Stripe webhook secret is not configured",
      "CONFIGURATION"
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    throw new RepositoryError(
      error instanceof Error ? error.message : "Invalid Stripe webhook signature",
      "VALIDATION"
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event);
    case "checkout.session.expired":
      return handleCheckoutSessionExpired(event);
    case "payment_intent.payment_failed":
      return handlePaymentIntentFailed(event);
    default:
      return { received: true, eventType: event.type };
  }
}

async function handleCheckoutSessionCompleted(
  event: Stripe.Event
): Promise<StripeWebhookResult> {
  const session = event.data.object as Stripe.Checkout.Session;
  const existing = await getPaymentBySessionId(session.id);

  if (existing?.status === "Paid") {
    return {
      received: true,
      duplicate: true,
      eventType: event.type,
    };
  }

  if (existing) {
    await updatePaymentStatus(existing._id.toString(), {
      status: "Paid",
      providerSessionId: session.id,
      providerPaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
      providerConfirmedAt: new Date(),
    });
  }

  const quoteId = session.metadata?.quoteId;
  const bookingId = session.metadata?.bookingId;

  if (quoteId) {
    await updateQuoteStatus(quoteId, "Accepted");
  }

  if (bookingId) {
    await updateBooking(bookingId, {
      status: "Customer Accepted",
      auditEntry: {
        action: "payment_completed",
        timestamp: new Date(),
        note: `Stripe checkout session ${session.id} completed`,
      },
    });
  }

  return { received: true, eventType: event.type };
}

async function handleCheckoutSessionExpired(
  event: Stripe.Event
): Promise<StripeWebhookResult> {
  const session = event.data.object as Stripe.Checkout.Session;
  const existing = await getPaymentBySessionId(session.id);

  if (!existing) {
    return { received: true, eventType: event.type };
  }

  if (existing.status === "Paid") {
    return {
      received: true,
      duplicate: true,
      eventType: event.type,
    };
  }

  await updatePaymentStatus(existing._id.toString(), {
    status: "Cancelled",
    providerSessionId: session.id,
  });

  return { received: true, eventType: event.type };
}

async function handlePaymentIntentFailed(
  event: Stripe.Event
): Promise<StripeWebhookResult> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  await connectDB();

  const { PaymentRecord } = await import("@/models");
  const existing = await PaymentRecord.findOne({
    providerPaymentIntentId: paymentIntent.id,
  }).lean();

  if (!existing) {
    return { received: true, eventType: event.type };
  }

  if (existing.status === "Failed" || existing.status === "Paid") {
    return {
      received: true,
      duplicate: true,
      eventType: event.type,
    };
  }

  await updatePaymentStatus(existing._id.toString(), {
    status: "Failed",
    providerPaymentIntentId: paymentIntent.id,
  });

  return { received: true, eventType: event.type };
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}
