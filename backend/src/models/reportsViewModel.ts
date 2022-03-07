import { Prisma } from '.prisma/client';

export interface averageShippingCosts {
  "Year": number,
  "Trans Method": string,
  "FOB Shipping Costs": number,
  "Duty Costs": number,
  "Units": number,
  "Insurance Costs": number,
  "Avg $/Pair": number
}