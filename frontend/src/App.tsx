import { useState } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceResult from "./components/InvoiceResult";
import PayazaAuthTest from "./components/PayazaAuthTest";
import AgencyDashboard from "./components/AgencyDashboard";
import CreatorView from "./components/CreatorView";
import type { Invoice } from "./lib/api";

type View = "create" | "agency" | "creator";

function App() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [view, setView] = useState<View>("create");

  if (window.location.search.includes("authtest")) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <PayazaAuthTest />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-center gap-2 p-4 border-b border-gray-800">
        <button
          onClick={() => setView("create")}
          className={`px-4 py-2 rounded ${view === "create" ? "bg-white text-black" : "bg-gray-800"}`}
        >
          Create Invoice
        </button>
        <button
          onClick={() => setView("agency")}
          className={`px-4 py-2 rounded ${view === "agency" ? "bg-white text-black" : "bg-gray-800"}`}
        >
          Agency View
        </button>
        <button
          onClick={() => setView("creator")}
          className={`px-4 py-2 rounded ${view === "creator" ? "bg-white text-black" : "bg-gray-800"}`}
        >
          Creator View
        </button>
      </nav>

      {view === "create" &&
        (!invoice ? (
          <InvoiceForm onCreated={setInvoice} />
        ) : (
          <InvoiceResult invoice={invoice} />
        ))}
      {view === "agency" && <AgencyDashboard />}
      {view === "creator" && <CreatorView />}
    </div>
  );
}

export default App;
