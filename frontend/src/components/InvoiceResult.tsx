import { useState } from "react";
import type { Invoice } from "../lib/api";
import { openCheckout } from "../lib/checkout";

export default function InvoiceResult({ invoice }: { invoice: Invoice }) {
  const [message, setMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const isPaid = invoice.status === "PAID";

  const handlePay = async () => {
    setMessage(null);
    try {
      await openCheckout(
        invoice,
        (result) => setMessage(JSON.stringify(result, null, 2)),
        () => setMessage((m) => m ?? "Checkout closed before payment completed")
      );
    } catch {
      setMessage("Could not start checkout");
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(invoice.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/pay/${invoice.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto p-6 md:p-10 space-y-8 bg-card border border-border rounded-sm">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Invoice Created</h2>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-none">
            ID: {invoice.id}
          </span>
          <button 
            onClick={handleCopyId}
            className="text-xs text-primary hover:text-primary-foreground hover:bg-primary transition-colors cursor-pointer px-1.5 py-0.5 rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            {copiedId ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="border border-border p-5 space-y-4 rounded-sm">
        <dl className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Client</dt>
            <dd className="text-lg font-medium text-foreground">{invoice.clientName}</dd>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border/50">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</dt>
            <dd className="text-2xl font-semibold text-foreground">{invoice.amount} {invoice.currencyCode}</dd>
          </div>
          <div className="flex justify-between items-center pt-1">
            <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</dt>
            <dd>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-medium uppercase tracking-wide border ${isPaid ? "text-success border-success/30 bg-success/10" : "text-warning border-warning/30 bg-warning/10"}`}>
                {invoice.status}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="border border-border rounded-sm bg-muted/20">
        <div className="p-4 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Split breakdown</p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <div>
              <p className="text-foreground font-medium">Creator</p>
              <p className="text-xs text-muted-foreground">{invoice.creatorSharePercent}%</p>
            </div>
            <span className="font-medium tabular-nums">{invoice.creatorAmount?.toFixed(2) ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <div>
              <p className="text-foreground font-medium">Agency</p>
              <p className="text-xs text-muted-foreground">{invoice.agencySharePercent}%</p>
            </div>
            <span className="font-medium tabular-nums">{invoice.agencyAmount?.toFixed(2) ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-3 border-t border-border">
            <div>
              <p className="text-foreground font-medium">Platform</p>
              <p className="text-xs text-muted-foreground">{invoice.platformSharePercent}%</p>
            </div>
            <span className="font-medium tabular-nums">{invoice.platformAmount?.toFixed(2) ?? "—"}</span>
          </div>
        </div>
      </div>

      {!isPaid && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            className="w-full bg-success text-primary-foreground py-3 font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={handlePay}
          >
            Proceed to Payment
          </button>
          <button
            className="w-full bg-card border border-border text-foreground py-3 font-medium rounded-sm hover:bg-muted transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={handleCopyLink}
          >
            {copiedLink ? "Copied" : "Copy payment link"}
          </button>
        </div>
      )}

      {message && (
        <pre className="text-xs font-mono whitespace-pre-wrap bg-muted border border-border p-4 text-muted-foreground rounded-sm">
          {message}
        </pre>
      )}
    </div>
  );
}
