import type { Invoice } from "./api";
import { createCheckout } from "./payaza";

const API_BASE_URL = "http://localhost:8080";

// Flip to true once GET /api/invoices/{id}/checkout exists on the backend
const USE_BACKEND_CHECKOUT = true;

export interface CheckoutConfig {
  merchantKey: string;
  connectionMode: "Test" | "Live";
  checkoutAmount: number;
  currencyCode: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  transactionReference: string;
}

async function getConfig(invoice: Invoice): Promise<CheckoutConfig> {
  if (USE_BACKEND_CHECKOUT) {
    const res = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/checkout`);
    if (!res.ok) throw new Error("Failed to get checkout config");
    return res.json();
  }
  const [firstName, ...rest] = invoice.clientName.trim().split(" ");
  return {
    merchantKey: import.meta.env.VITE_PAYAZA_MERCHANT_KEY,
    connectionMode: "Test",
    checkoutAmount: Number(invoice.amount),
    currencyCode: invoice.currencyCode,
    emailAddress: invoice.clientEmail,
    firstName,
    lastName: rest.join(" ") || "Client",
    phoneNumber: invoice.clientPhone || "+254712345678",
    transactionReference: "PSA-" + invoice.id.slice(0, 8) + "-" + Date.now(),
  };
}

export async function openCheckout(
  invoice: Invoice,
  onResult: (result: unknown) => void,
  onClose: () => void
) {
  const c = await getConfig(invoice);
  const checkout = createCheckout(
    {
      merchant_key: c.merchantKey,
      connection_mode: c.connectionMode,
      checkout_amount: c.checkoutAmount,
      currency_code: c.currencyCode,
      email_address: c.emailAddress,
      first_name: c.firstName,
      last_name: c.lastName,
      phone_number: c.phoneNumber,
      transaction_reference: c.transactionReference,
      additional_details: { invoice_id: invoice.id },
      biller_name: "PaySplit Africa",
    },
    onResult,
    onClose
  );
  checkout.showPopup();
}
