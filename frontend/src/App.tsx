import { useState, useEffect } from "react";
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
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("paysplit-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("paysplit-theme", theme);
  }, [theme]);

  if (window.location.search.includes("authtest")) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <PayazaAuthTest />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-200">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-sm font-medium px-3 py-1.5 border border-border rounded-sm bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-200 cursor-pointer"
        >
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
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
