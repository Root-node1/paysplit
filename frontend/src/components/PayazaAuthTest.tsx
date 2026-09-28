import { useState } from "react";
import { createCheckout } from "../lib/payaza";

export default function PayazaAuthTest() {
  const [currency, setCurrency] = useState("USD");
  const [log, setLog] = useState("");

  const run = () => {
    setLog("");
    try {
      const checkout = createCheckout(
        {
          merchant_key: import.meta.env.VITE_PAYAZA_MERCHANT_KEY,
          connection_mode: "Test",
          checkout_amount: 10,
          currency_code: currency,
          email_address: "test@example.com",
          first_name: "Test",
          last_name: "User",
          phone_number: "+254712345678",
          transaction_reference: "PSA-TEST-" + Date.now(),
          biller_name: "PaySplit Africa",
        },
        (response) => setLog(JSON.stringify(response, null, 2)),
        () => setLog((prev) => prev || "Modal closed, no result")
      );
      checkout.showPopup();
    } catch (err) {
      setLog(String(err));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Payaza auth test</h2>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full border rounded px-3 py-2 bg-gray-900"
      >
        <option>USD</option>
        <option>KES</option>
      </select>
      <button onClick={run} className="w-full bg-green-600 rounded px-4 py-2">
        Open Payaza modal
      </button>
      <pre className="text-xs whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
