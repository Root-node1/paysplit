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
      <div className="border-b border-border w-full">
        <nav className="flex justify-center max-w-3xl mx-auto">
          <button
            onClick={() => setView("create")}
            className={`h-10 px-5 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-none ${view === "create" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground bg-transparent"}`}
          >
            Create Invoice
          </button>
          <button
            onClick={() => setView("agency")}
            className={`h-10 px-5 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-none ${view === "agency" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground bg-transparent"}`}
          >
            Agency View
          </button>
          <button
            onClick={() => setView("creator")}
            className={`h-10 px-5 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-none ${view === "creator" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground bg-transparent"}`}
          >
            Creator View
          </button>
        </nav>
      </div>

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
