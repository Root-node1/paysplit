import { useState } from "react";
import type { Invoice } from "../lib/api";
import { openCheckout } from "../lib/checkout";

export default function InvoiceResult({ invoice }: { invoice: Invoice }) {
  const [message, setMessage] = useState<string | null>(null);
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

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Invoice Created</h2>
        <p className="text-gray-400 text-sm">ID: {invoice.id}</p>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-400">Client</span>
          <span>{invoice.clientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Amount</span>
          <span>{invoice.amount} {invoice.currencyCode}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status</span>
          <span className={isPaid ? "text-green-500" : "text-yellow-500"}>
            {invoice.status}
          </span>
        </div>
      </div>

      <div className="border border-gray-700 rounded-lg p-4 space-y-2">
        <p className="text-sm text-gray-400 mb-2">Split breakdown</p>
        <div className="flex justify-between text-sm">
          <span>Creator ({invoice.creatorSharePercent}%)</span>
          <span>{invoice.creatorAmount?.toFixed(2) ?? "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Agency ({invoice.agencySharePercent}%)</span>
          <span>{invoice.agencyAmount?.toFixed(2) ?? "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Platform ({invoice.platformSharePercent}%)</span>
          <span>{invoice.platformAmount?.toFixed(2) ?? "—"}</span>
        </div>
      </div>

      {!isPaid && (
        <button
          className="w-full bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
          onClick={handlePay}
        >
          Proceed to Payment
        </button>
      )}

      {message && (
        <pre className="text-xs whitespace-pre-wrap border border-gray-700 rounded p-3">
          {message}
        </pre>
      )}
    </div>
  );
}
