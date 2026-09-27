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
    } catch (err) {
      setError("Could not create invoice. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6">
      <h2 className="text-xl font-semibold">Create Invoice</h2>

      <input
        name="clientName"
        placeholder="Client name"
        value={form.clientName}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="clientEmail"
        type="email"
        placeholder="Client email"
        value={form.clientEmail}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="clientPhone"
        placeholder="Client phone (+254...)"
        value={form.clientPhone}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />

      <div className="grid grid-cols-3 gap-2">
        <input
          name="creatorSharePercent"
          type="number"
          placeholder="Creator %"
          value={form.creatorSharePercent}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <input
          name="agencySharePercent"
          type="number"
          placeholder="Agency %"
          value={form.agencySharePercent}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
        <input
          name="platformSharePercent"
          type="number"
          placeholder="Platform %"
          value={form.platformSharePercent}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}
