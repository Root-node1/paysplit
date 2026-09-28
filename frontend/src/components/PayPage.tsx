import { useEffect, useState } from "react";
import { openCheckout } from "../lib/checkout";

interface CheckoutConfig {
  merchantKey: string;
  connectionMode: "Test" | "Live";
  checkoutAmount: number;
  currencyCode: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transactionReference: string;
  splitAccounts?: Array<{
    recipientType: string;
    percent: number;
    amount: number;
  }>;
}

type Phase = "loading" | "ready" | "paying" | "verifying" | "paid" | "error";

const API_BASE_URL = "http://localhost:8080";

export default function PayPage({ invoiceId }: { invoiceId: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [config, setConfig] = useState<CheckoutConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}/checkout`);
        if (res.status === 409) throw new Error("This invoice has already been paid.");
        if (res.status === 404) throw new Error("Invoice not found.");
        if (!res.ok) throw new Error(`Could not load payment details (HTTP ${res.status}).`);
        const data = (await res.json()) as CheckoutConfig;
        if (!cancelled) {
          setConfig(data);
          setPhase("ready");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load");
          setPhase("error");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [invoiceId]);

  async function pollUntilPaid() {
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await fetch(`${API_BASE_URL}/api/invoices/${invoiceId}`);
        if (res.ok) {
          const inv = await res.json();
          if (inv.status === "PAID") {
            setPhase("paid");
            return;
          }
          if (inv.status === "FAILED") {
            setError("Payment failed");
            setPhase("error");
            return;
          }
        }
      } catch { /* keep polling */ }
    }
    setError("Timed out waiting for confirmation");
    setPhase("error");
  }

  function handlePay() {
    if (!config) return;
    setPhase("paying");

    const fakeInvoice = {
      id: invoiceId,
      clientName: `${config.firstName} ${config.lastName}`.trim(),
      clientEmail: config.emailAddress,
      amount: config.checkoutAmount,
      currencyCode: config.currencyCode,
      clientPhone: config.phoneNumber,
    } as Parameters<typeof openCheckout>[0];

    openCheckout(
      fakeInvoice,
      () => {
        setPhase("verifying");
        pollUntilPaid();
      },
      () => {
        setPhase((p) => (p === "verifying" || p === "paid" ? p : "ready"));
      }
    );
  }

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (phase === "error" || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <div className="max-w-md w-full bg-card border border-border rounded-sm p-8 text-center">
          <h1 className="text-xl font-semibold mb-2">Payment unavailable</h1>
          <p className="text-sm text-muted-foreground">{error ?? "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-card border border-border rounded-sm p-8 space-y-8">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Paying</p>
          <h1 className="text-2xl font-semibold">Nairobi Glow Media</h1>
          <p className="text-sm text-muted-foreground">for Amina Wanjiku — Safaricom Campaign</p>
        </header>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Amount</p>
          <p className="text-4xl font-semibold tabular-nums">
            {config.checkoutAmount} <span className="text-lg text-muted-foreground">{config.currencyCode}</span>
          </p>
        </div>

        {config.splitAccounts && config.splitAccounts.length > 0 && (
          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Split preview</p>
            <dl className="grid grid-cols-3 gap-4">
              {config.splitAccounts.map((s) => (
                <div key={s.recipientType}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.recipientType}</dt>
                  <dd className="text-sm font-medium tabular-nums">
                    {s.amount.toFixed(2)} <span className="text-muted-foreground">{config.currencyCode}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {phase === "ready" && (
          <button
            onClick={handlePay}
            className="w-full bg-success text-white py-3 rounded-sm font-medium hover:opacity-90 transition-opacity cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Pay {config.checkoutAmount} {config.currencyCode}
          </button>
        )}

        {phase === "paying" && (
          <p className="text-center text-sm text-muted-foreground">Opening checkout…</p>
        )}

        {phase === "verifying" && (
          <p className="text-center text-sm text-muted-foreground">Verifying payment…</p>
        )}

        {phase === "paid" && (
          <div className="text-center space-y-1">
            <p className="text-success text-lg font-medium">Paid ✓</p>
            <p className="text-xs text-muted-foreground">The invoice has been marked as PAID.</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Ref: <span className="font-mono">{config.transactionReference}</span>
        </p>
      </div>
    </div>
  );
}
