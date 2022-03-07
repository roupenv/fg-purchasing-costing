import { Prisma } from '../services/prismaClient';

export interface allPayments {
  id: number;
  reference_number: string;
  date_booked: Date;
  payment_exch_rate: number | null;
  total_usd_cost: string;
  total_euro_payment: string;
  number_payees: number;
}

export interface payment {
  header: {
    id: number | undefined;
    reference_number: string | undefined;
    date_booked: Date | undefined;
    payment_exch_rate: number | null | undefined;
  };
  data:
    | {
        id: number;
        vendor: string;
        usd_cost: Prisma.Decimal | null;
        euro_payment: Prisma.Decimal | null;
        tracking_number: string | null;
        description: string | null;
      }[]
    | undefined;
}

export interface paymentLineItems {
  id: number;
  vendor: string;
  usd_cost: Prisma.Decimal | null;
  euro_payment: Prisma.Decimal | null;
  tracking_number: string | null;
  description: string | null;
}

export interface newPayment {
  header: {
    reference_number: string;
    date_booked: string | null;
    payment_exch_rate: number;
  };
  data: {
    id: number;
    vendor: string;
    usd_cost: number;
    euro_payment: number;
    tracking_number: string;
    description: string;
  }[];
}

export interface record {
  id: number;
}

export interface createNewPayment {
  id: number;
  payment_vendor_fk: number | null;
  reference_number: string;
  date_booked: Date;
  payment_exch_rate: number | null;
}
