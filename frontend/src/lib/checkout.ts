import type { Invoice } from "./api";
import { createCheckout } from "./payaza";

const API_BASE_URL = "http://localhost:8080";

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
  const res = await fetch(`${API_BASE_URL}/api/invoices/${invoice.id}/checkout`);
  if (!res.ok) throw new Error(`Failed to get checkout config: HTTP ${res.status}`);
  return res.json();
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
