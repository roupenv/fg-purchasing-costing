import { Prisma } from '.prisma/client';

export interface allInvoices {
  id: number;
  invoice_number: string;
  date: Date;
  vendor: string | undefined;
  total_quantity: string;
  invoice_total: string;
}

export interface invoiceHeader {
  id?: number | undefined;
  invoice_number: string | undefined;
  date: Date | undefined;
  vendor: string | undefined;
}

export interface invoiceLineItems {
  id: number;
  po_ref: string | null;
  product: string | undefined;
  color: string | null;
  quantity: number | null;
  price: Prisma.Decimal | number | null;
  discount: Prisma.Decimal | number | null;
  line_total: Prisma.Decimal | number | null;
  sample: boolean | null;
}

export interface invoice {
  header: invoiceHeader;
  data: invoiceLineItems[] | undefined;
}

export interface invoiceRecord {
  id: number;
}

export interface contextLink {
  value: string;
  label: string;
}
