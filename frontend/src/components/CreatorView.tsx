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

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Creator: My Earnings</h2>
      {invoices.length === 0 && <p className="text-gray-400">No invoices yet.</p>}
      {invoices.map((inv) => (
        <div key={inv.id} className="border border-gray-700 rounded-lg p-4 space-y-1">
          <div className="flex justify-between">
            <span>From: {inv.clientName}</span>
            <span
              className={
                inv.status === "PAID"
                  ? "text-green-500"
                  : inv.status === "FAILED"
                  ? "text-red-500"
                  : "text-yellow-500"
              }
            >
              {inv.status}
            </span>
          </div>
          <div className="text-lg font-medium">
            {inv.creatorAmount?.toFixed(2) ?? "—"} {inv.currencyCode}
          </div>
          <div className="text-xs text-gray-500">
            {inv.creatorSharePercent}% of {inv.amount} {inv.currencyCode}
          </div>
          {inv.status === "PAID" && (
            <div className="text-xs text-gray-400">Payout: queued (roadmap)</div>
          )}
        </div>
      ))}
    </div>
  );
}
