const API_BASE_URL = "http://localhost:8080";

export interface CreateInvoicePayload {
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  amount: number;
  currencyCode: string;
  creatorSharePercent: number;
  agencySharePercent: number;
  platformSharePercent: number;
}

export interface Invoice extends CreateInvoicePayload {
  id: string;
  status: "PENDING" | "PAID" | "FAILED";
  transactionReference: string | null;
  createdAt: string;
  paidAt?: string | null;
  creatorAmount?: number;
  agencyAmount?: number;
  platformAmount?: number;
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  const res = await fetch(`${API_BASE_URL}/api/invoices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create invoice");
  return res.json();
}

export async function getInvoice(id: string): Promise<Invoice> {
  const res = await fetch(`${API_BASE_URL}/api/invoices/${id}`);
  if (!res.ok) throw new Error("Failed to fetch invoice");
  return res.json();
}

export async function listInvoices(): Promise<Invoice[]> {
  const res = await fetch(`${API_BASE_URL}/api/invoices`);
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
}
