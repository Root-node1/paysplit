import { useEffect, useState } from "react";
import { listInvoices, type Invoice } from "../lib/api";

export default function AgencyDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listInvoices()
      .then(setInvoices)
      .catch(() => setError("Could not load invoices"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 md:p-10 text-center text-muted-foreground font-medium">Loading invoices...</p>;
  if (error) return <p className="p-6 md:p-10 text-center text-destructive font-medium">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Agency Dashboard</h2>
        <p className="text-sm text-muted-foreground">Overview of all generated invoices and splits.</p>
      </div>
      
      {invoices.length === 0 && <p className="text-muted-foreground text-center py-12 border border-dashed border-border rounded-sm">No invoices found.</p>}
      
      <div className="grid gap-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-sm p-5 space-y-4 hover:border-muted-foreground/30 transition-colors duration-200">
            <div className="flex justify-between items-start">
              <span className="text-base font-medium text-foreground">{inv.clientName}</span>
              <span
                className={`text-xs font-medium tracking-wide uppercase px-2 py-0.5 border rounded-sm ${
                  inv.status === "PAID"
                    ? "text-success border-success/30 bg-success/10"
                    : inv.status === "FAILED"
                    ? "text-destructive border-destructive/30 bg-destructive/10"
                    : "text-warning border-warning/30 bg-warning/10"
                }`}
              >
                {inv.status}
              </span>
            </div>
            
            <div className="text-xl font-semibold tabular-nums text-foreground">
              {inv.amount} <span className="text-sm font-medium text-muted-foreground">{inv.currencyCode}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Creator</span>
                <span className="text-sm tabular-nums font-medium text-foreground">{inv.creatorAmount?.toFixed(2) ?? "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Agency</span>
                <span className="text-sm tabular-nums font-medium text-foreground">{inv.agencyAmount?.toFixed(2) ?? "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Platform</span>
                <span className="text-sm tabular-nums font-medium text-foreground">{inv.platformAmount?.toFixed(2) ?? "—"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
