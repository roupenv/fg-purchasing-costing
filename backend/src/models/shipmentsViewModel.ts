import { Prisma } from '.prisma/client';

export interface allShipments {
    id: number;
    shipment_ref: string;
    invoice_number: string | null | undefined;
    arrival_date: Date | null;
    trans_method: string | null;
    packs: number | null;
    units_shipped: number | null;
    shipping_costs: Prisma.Decimal | null;
    duty_costs: Prisma.Decimal | null;
    insurance_costs: Prisma.Decimal | null;
    vendor: string | undefined;
}

export interface shipmentHeader {
  id?: number;
  shipment_ref: string;
  vendor: string | undefined;
  shipment_invoice: string | undefined;
  departure_date: Date | string | null;
  arrival_date: Date | string | null;
  trans_method: string | null;
  weight: number | null;
  weight_unit: string | null;
  volume: number | null;
  volume_unit: string | null;
  chargeable_weight: number | null;
  chargeable_weight_unit: string | null;
  packs: number | null;
  packs_type: string | null;
  units_shipped: number | null;
  shipping_costs: Prisma.Decimal |  number |null;
  duty_costs: Prisma.Decimal | number | null;
  insurance_costs: Prisma.Decimal | number | null;
  euro_value: Prisma.Decimal | number | null;
  us_value: Prisma.Decimal | number | null;
}

export interface shipmentLineItems {
    id: number;
    tarrif: string;
    units_entered: number | null;
    value_entered: Prisma.Decimal | number | null;
    duty_percentage: number | null;
    processing_fee_percentage: number | null;
    line_total: Prisma.Decimal | number | null;
}

export interface shipment{
  header: shipmentHeader | undefined
  data: shipmentLineItems[] | undefined
}

export interface shipmentDutyLineItems{
  id: number;
  tarrif: string;
  units_entered: number | null;
  value_entered: Prisma.Decimal | null;
  duty_percentage: number | null;
  processing_fee_percentage: number | null;
  line_total: Prisma.Decimal | null;
}

export interface shipmentRecord {
  id: number
}
