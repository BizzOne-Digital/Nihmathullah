"use client";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { PublicQuote } from "@/lib/api/quotes";
import { Button } from "@/components/ui/Button";

interface QuotePaymentPageProps {
  token: string;
  paymentEnabled: boolean;
  currency?: string;
}

export function QuotePaymentPage({
  token,
  paymentEnabled,
  currency = "USD",
}: QuotePaymentPageProps) {
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quotes/${encodeURIComponent(token)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Quote not found or expired");
      }
      const data = await res.json();
      setQuote(data.quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quote");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/quotes/${encodeURIComponent(token)}/accept`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to accept quote");
      }
      await loadQuote();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept quote");
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Payment could not be started");
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <p className="text-muted-silver">Loading your quote...</p>;
  }

  if (error && !quote) {
    return (
      <div className="rounded-sm border border-red-500/30 bg-charcoal/40 p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!quote) return null;

  const payAmount = quote.depositAmount > 0 ? quote.depositAmount : quote.total;
  const isAccepted = quote.status === "Accepted";
  const isExpired = new Date(quote.expiresAt).getTime() <= Date.now();
  const canPay = paymentEnabled && !isAccepted && !isExpired && payAmount > 0;

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-antique-gold/20 bg-charcoal/40 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-signature-gold">Quote Reference</p>
            <h2 className="font-display text-2xl text-ivory">{quote.reference}</h2>
            <p className="mt-1 text-sm text-muted-silver">
              Expires {new Date(quote.expiresAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-silver">Status</p>
            <p className="font-medium text-signature-gold">{quote.status}</p>
          </div>
        </div>

        {quote.customerNotes && (
          <p className="mt-6 text-sm text-muted-silver leading-relaxed">{quote.customerNotes}</p>
        )}

        <div className="mt-8 space-y-3">
          {quote.lineItems.map((item, i) => (
            <div key={i} className="flex justify-between gap-4 text-sm">
              <div>
                <p className="text-ivory">{item.label}</p>
                {item.description && (
                  <p className="text-muted-silver">{item.description}</p>
                )}
              </div>
              <p className="text-ivory">{formatCurrency(item.amount, currency)}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2 border-t border-antique-gold/20 pt-6 text-sm">
          <div className="flex justify-between text-muted-silver">
            <span>Subtotal</span>
            <span>{formatCurrency(quote.subtotal, currency)}</span>
          </div>
          {quote.taxAmount > 0 && (
            <div className="flex justify-between text-muted-silver">
              <span>Tax</span>
              <span>{formatCurrency(quote.taxAmount, currency)}</span>
            </div>
          )}
          {quote.feeAmount > 0 && (
            <div className="flex justify-between text-muted-silver">
              <span>Fees</span>
              <span>{formatCurrency(quote.feeAmount, currency)}</span>
            </div>
          )}
          <div className="flex justify-between font-display text-xl text-ivory">
            <span>Total</span>
            <span>{formatCurrency(quote.total, currency)}</span>
          </div>
          {quote.depositAmount > 0 && quote.depositAmount < quote.total && (
            <div className="flex justify-between text-signature-gold">
              <span>Deposit due now</span>
              <span>{formatCurrency(quote.depositAmount, currency)}</span>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-4">
        {!isAccepted && !isExpired && (
          <Button type="button" variant="outline" onClick={handleAccept}>
            Accept Quote
          </Button>
        )}
        {canPay && (
          <Button
            type="button"
            variant="gold"
            magnetic
            disabled={checkoutLoading}
            onClick={handleCheckout}
          >
            {checkoutLoading
              ? "Redirecting..."
              : quote.depositAmount > 0 && quote.depositAmount < quote.total
                ? `Pay Deposit ${formatCurrency(quote.depositAmount, currency)}`
                : `Pay ${formatCurrency(payAmount, currency)}`}
          </Button>
        )}
        {isAccepted && (
          <p className="text-sm text-signature-gold">This quote has been accepted. Thank you!</p>
        )}
        {isExpired && (
          <p className="text-sm text-red-400">This quote has expired. Please contact us for an updated quote.</p>
        )}
      </div>
    </div>
  );
}
