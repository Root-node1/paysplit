import { useState, useEffect } from "react";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceResult from "./components/InvoiceResult";
import PayazaAuthTest from "./components/PayazaAuthTest";
import AgencyDashboard from "./components/AgencyDashboard";
import CreatorView from "./components/CreatorView";
import PayPage from "./components/PayPage";
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

  // Public payment link: /pay/{invoiceId}
  const payMatch = window.location.pathname.match(/^\/pay\/([^/]+)\/?$/);
  if (payMatch) {
    return <PayPage invoiceId={payMatch[1]} />;
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

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        <nav className="flex items-center justify-center gap-2 border-b border-border pb-4">
          {([
            ["create", "Create Invoice"],
            ["agency", "Agency View"],
            ["creator", "Creator View"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={
                "px-5 h-10 text-sm font-medium rounded-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
                (view === key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {label}
            </button>
          ))}
        </nav>

        {view === "create" && (
          <div className="max-w-2xl mx-auto">
            <InvoiceForm onCreated={setInvoice} />
            {invoice && <InvoiceResult invoice={invoice} />}
          </div>
        )}

        {view === "agency" && <AgencyDashboard />}

        {view === "creator" && <CreatorView />}
      </div>
    </div>
  );
}

export default App;
