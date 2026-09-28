import { useState } from "react";
import { createInvoice, type Invoice } from "../lib/api";

export default function InvoiceForm({ onCreated }: { onCreated: (invoice: Invoice) => void }) {
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    amount: "",
    currencyCode: "USD",
    creatorSharePercent: "80",
    agencySharePercent: "15",
    platformSharePercent: "5",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const invoice = await createInvoice({
        clientName: form.clientName,
        clientEmail: form.clientEmail,
        clientPhone: form.clientPhone || undefined,
        amount: Number(form.amount),
        currencyCode: form.currencyCode,
        creatorSharePercent: Number(form.creatorSharePercent),
        agencySharePercent: Number(form.agencySharePercent),
        platformSharePercent: Number(form.platformSharePercent),
      });
      onCreated(invoice);
    } catch {
      setError("Could not create invoice. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const totalSplit = Number(form.creatorSharePercent) + Number(form.agencySharePercent) + Number(form.platformSharePercent);
  const isSplitValid = totalSplit === 100;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 md:p-10 space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Invoice</h2>
        <p className="text-sm text-muted-foreground">Fill in the details below to generate a new invoice.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Client Name</label>
          <input
            name="clientName"
            placeholder="Client name"
            value={form.clientName}
            onChange={handleChange}
            required
            className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Client Email</label>
          <input
            name="clientEmail"
            type="email"
            placeholder="Client email"
            value={form.clientEmail}
            onChange={handleChange}
            required
            className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Client Phone</label>
          <input
            name="clientPhone"
            placeholder="+254..."
            value={form.clientPhone}
            onChange={handleChange}
            className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
          />
          <p className="text-xs text-muted-foreground">Optional phone number with country code.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Amount (USD)</label>
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex justify-between items-end">
            <h3 className="text-sm font-medium text-foreground">Split Percentages</h3>
            <span className={`text-xs font-medium ${isSplitValid ? 'text-muted-foreground' : 'text-destructive'}`}>
              Total: {totalSplit}%
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">Creator %</label>
              <input
                name="creatorSharePercent"
                type="number"
                placeholder="Creator"
                value={form.creatorSharePercent}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">Agency %</label>
              <input
                name="agencySharePercent"
                type="number"
                placeholder="Agency"
                value={form.agencySharePercent}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-medium text-muted-foreground">Platform %</label>
              <input
                name="platformSharePercent"
                type="number"
                placeholder="Platform"
                value={form.platformSharePercent}
                onChange={handleChange}
                className="w-full bg-card border border-border rounded-sm px-3 py-2 text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-destructive text-sm font-medium p-3 bg-destructive/10 border border-destructive rounded-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !isSplitValid}
        className="w-full bg-success text-primary-foreground px-6 py-3 font-medium rounded-sm hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}
