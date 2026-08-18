import type { IQuote } from "@/models";
import type { IPricingSettings } from "@/models";
import type { QuoteLineItem } from "@/types";

export type PublicQuote = {
  reference: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  total: number;
  depositAmount: number;
  customerNotes?: string;
  status: IQuote["status"];
  expiresAt: string;
  acceptedAt?: string;
  viewedAt?: string;
};

export function toPublicQuote(quote: IQuote): PublicQuote {
  return {
    reference: quote.reference,
    lineItems: quote.lineItems,
    subtotal: quote.subtotal,
    taxAmount: quote.taxAmount,
    feeAmount: quote.feeAmount,
    total: quote.total,
    depositAmount: quote.depositAmount,
    customerNotes: quote.customerNotes,
    status: quote.status,
    expiresAt: quote.expiresAt.toISOString(),
    acceptedAt: quote.acceptedAt?.toISOString(),
    viewedAt: quote.viewedAt?.toISOString(),
  };
}

export function toAdminQuote(quote: IQuote): Record<string, unknown> {
  const serialized = JSON.parse(JSON.stringify(quote)) as Record<string, unknown>;
  delete serialized.tokenHash;
  return serialized;
}

export function calculateQuoteTotals(
  lineItems: QuoteLineItem[],
  pricing: IPricingSettings
): {
  subtotal: number;
  taxAmount: number;
  feeAmount: number;
  total: number;
  depositAmount: number;
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = pricing.taxRate
    ? Math.round(subtotal * pricing.taxRate)
    : 0;
  const feeAmount = pricing.feeRate
    ? Math.round(subtotal * pricing.feeRate)
    : 0;
  const total = subtotal + taxAmount + feeAmount;

  let depositAmount = 0;
  switch (pricing.depositMode) {
    case "full":
      depositAmount = total;
      break;
    case "fixed":
      depositAmount = pricing.depositFixedAmount ?? 0;
      break;
    case "percentage":
      depositAmount = Math.round(
        total * ((pricing.depositPercentage ?? 0) / 100)
      );
      break;
    case "none":
      depositAmount = 0;
      break;
  }

  return { subtotal, taxAmount, feeAmount, total, depositAmount };
}
