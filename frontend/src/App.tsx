import { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceResult from "./components/InvoiceResult";
import type { Invoice } from "./lib/api";

function App() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!invoice ? (
        <InvoiceForm onCreated={setInvoice} />
      ) : (
        <InvoiceResult invoice={invoice} />
      )}
    </div>
  );
}

export default App;
