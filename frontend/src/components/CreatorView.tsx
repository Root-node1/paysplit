import { useEffect, useState } from "react";
import { listInvoices, type Invoice } from "../lib/api";

export default function CreatorView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listInvoices()
      .then(setInvoices)
      .catch(() => setError("Could not load invoices"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 md:p-10 text-center text-muted-foreground font-medium">Loading...</p>;
  if (error) return <p className="p-6 md:p-10 text-center text-destructive font-medium">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Creator Earnings</h2>
        <p className="text-sm text-muted-foreground">Track your invoices and payouts.</p>
      </div>

      {invoices.length === 0 && <p className="text-muted-foreground text-center py-12 border border-dashed border-border rounded-sm">No invoices yet.</p>}
      
      <div className="grid gap-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-sm p-5 space-y-3 hover:border-muted-foreground/30 transition-colors duration-200">
            <div className="text-sm text-muted-foreground">
              From {inv.clientName}
            </div>
            
            <div className="text-3xl font-semibold tabular-nums text-foreground">
              {inv.creatorAmount?.toFixed(2) ?? "—"} <span className="text-lg font-medium text-muted-foreground ml-1">{inv.currencyCode}</span>
            </div>
            
            <div className="pt-2">
              {inv.status === "PAID" ? (
                <div className="flex items-center gap-1.5 text-success">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Paid</span>
                </div>
              ) : inv.status === "FAILED" ? (
                <div className="text-xs text-destructive font-medium">Payment failed.</div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Queued — paid out on campaign close
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
