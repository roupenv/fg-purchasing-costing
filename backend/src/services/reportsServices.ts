import { prisma, Prisma } from './prismaClient';
import Services from './baseServicesClass';
import { ReportsInterface } from '../interfaces/ReportsInterface';
import * as viewModel from '../models/reportsViewModel';

export class ReportsPrismaServices extends Services implements ReportsInterface {
  startDate: string | undefined;
  endDate: string | undefined;
  commission: number | undefined;
  miscellaneous: number | undefined;
  exchangePadding: number | undefined;
  development: number | undefined;
  constructor(
    startDate: string | undefined = undefined,
    endDate: string | undefined = undefined,
    commission: number | undefined = undefined,
    miscellaneous: number | undefined = undefined,
    exchangePadding: number | undefined = undefined,
    development: number | undefined = undefined
  ) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
    this.commission = commission;
    this.miscellaneous = miscellaneous;
    this.exchangePadding = exchangePadding;
    this.development = development;
  }
  async averageShippingCosts() {
    const records = await prisma.$queryRaw<viewModel.averageShippingCosts[]>(Prisma.sql` 
      SELECT 
        EXTRACT(YEAR FROM shipment.arrival_date) as "Year",
        shipment.trans_method AS "Trans Method",
        SUM(shipment.shipping_costs) as "FOB Shipping Costs",
        SUM(shipment.duty_costs) as "Duty Costs",
        SUM(shipment.units_shipped) as "Units",
        SUM(shipment.insurance_costs) as "Insurance Costs",
        SUM(shipment.shipping_costs)/SUM(shipment.units_shipped) as "Avg $/Pair"
      FROM shipment  
      WHERE shipment.shipping_costs::numeric > 0
      GROUP BY EXTRACT(YEAR FROM shipment.arrival_date), shipment.trans_method
      ORDER BY EXTRACT(YEAR FROM shipment.arrival_date), shipment.trans_method ASC;
      `);
    return records;
  }

  async yearSummary() {
    let start, end;
    if (typeof this.startDate === 'string' && typeof this.endDate === 'string') {
      start = new Date(this.startDate);
      end = new Date(this.endDate);
    }
    const records = (await prisma.$queryRaw(Prisma.sql` 
      WITH invoice_summary AS(
        SELECT 
          invoice.id AS invoice_id,
          invoice.date as "invoice_date",
          SUM(invoice_line_items.quantity) as "total_units",
          SUM(invoice_line_items.line_total) As "total_amount",
          SUM(invoice_line_items.discount * invoice_line_items.quantity) as "total_disc"
        FROM invoice
        Inner JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
        GROUP BY invoice_id
        ),
        shipment_summary AS(
          SELECT 
          shipment.id as shipment_id,
          SUM(shipment.shipping_costs) as "total_shipping",
          SUM(shipment.duty_costs) as "total_duty",
          SUM(shipment.insurance_costs) as "total_insurance"
        FROM shipment
        GROUP BY shipment.id
        )
        SELECT 
          "invoice_date",
          "total_units",
          "total_amount",
          "total_disc",
          "total_shipping",
          "total_duty",
          "total_insurance"
        FROM invoice_summary
          INNER JOIN shipment_invoice ON shipment_invoice.invoice_id = invoice_summary.invoice_id
          INNER JOIN shipment_summary ON shipment_summary.shipment_id = shipment_invoice.shipment_id
        WHERE "invoice_date" >= ${start}  AND "invoice_date" <= ${end}
        ORDER BY "invoice_date" ASC
      `)) as any;

    const formattedRecords = records.map((record: any) => ({
      invoice_date: record.invoice_date,
      total_units: record.total_units,
      total_amount: record.total_amount ? Number.parseFloat(record.total_amount.toFixed(2)) : 0,
      total_disc: record.total_disc,
      total_shipping: record.total_shipping ? Number.parseFloat(record.total_shipping.toFixed(2)) : 0,
      total_duty: record.total_duty ? Number.parseFloat(record.total_duty.toFixed(2)) : 0,
      total_insurance: record.total_insurance ? Number.parseFloat(record.total_insurance.toFixed(2)) : 0,
    }));

    return formattedRecords;
  }

  async yearAvgOfSum() {
    const exchangePadding = this.exchangePadding! + 1;
    const records = (await prisma.$queryRaw(Prisma.sql` 
    WITH invoice_shipping_summary AS(
      WITH invoice_summary AS(
             SELECT 
               invoice.id AS invoice_id,
               invoice.date as "invoice_date",
               SUM(invoice_line_items.quantity) as "total_units",
               SUM(invoice_line_items.line_total) As "total_amount_euro"
             FROM invoice
             Inner JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
             GROUP BY invoice_id
             ),
             shipment_summary AS(
               SELECT 
               shipment.id as shipment_id,
               SUM(shipment.shipping_costs) as "total_shipping",
               SUM(shipment.duty_costs) as "total_duty",
               SUM(shipment.insurance_costs) as "total_insurance",
           AVG(shipment.us_value/shipment.euro_value)::numeric as "exch_rate",
           SUM(shipment.us_value) as "total_amount_us"
             FROM shipment
             GROUP BY shipment.id
             )
             SELECT 
          EXTRACT(YEAR FROM invoice_date) as year_summary,
               SUM(total_units) as sum_total_units,
               SUM(total_amount_euro) as sum_total_amount_euro,
           AVG(ROUND(exch_rate, 3)) as avg_exch_rate,
           -- Add 3% to cushion transactions fees paid to Broker not included in Duty Exchange
           SUM(total_amount_us * ${exchangePadding}::numeric ) as sum_total_amount_us,
               SUM(total_shipping) as sum_total_shipping,
               SUM(total_duty) as sum_total_duty,
               SUM(total_insurance) as sum_total_insurance,
           SUM(total_amount_us * ${this.commission}::numeric ) as commission,
           SUM(total_amount_us * ${this.miscellaneous}::numeric ) as misc,
           SUM(total_units * ${this.development}::numeric::money) as development
             FROM invoice_summary
               INNER JOIN shipment_invoice ON shipment_invoice.invoice_id = invoice_summary.invoice_id
               INNER JOIN shipment_summary ON shipment_summary.shipment_id = shipment_invoice.shipment_id
         GROUP BY year_summary)
     SELECT 
       year_summary,
       sum_total_units,
       sum_total_amount_euro/sum_total_units as avg_euro_per_unit,
       (sum_total_amount_us + sum_total_shipping + sum_total_duty+ sum_total_insurance + commission + misc +  development)/sum_total_units as avg_landed_per_unit,
       (((sum_total_amount_us + sum_total_shipping + sum_total_duty+ sum_total_insurance + commission + misc + development)/sum_total_units) - (sum_total_amount_euro/sum_total_units))/(sum_total_amount_euro/sum_total_units) as percent_diff
      FROM invoice_shipping_summary
      ORDER BY year_summary asc
      `)) as any;

    return records;
  }

  async yearAvgOfAvg() {
    let start, end;
    if (typeof this.startDate === 'string' && typeof this.endDate === 'string') {
      start = new Date(this.startDate);
      end = new Date(this.endDate);
    }
    const records = (await prisma.$queryRaw(Prisma.sql` 
    WITH invoice_shipping_summary AS(
      WITH invoice_summary AS(
             SELECT 
               invoice.id AS invoice_id,
               invoice.date as "invoice_date",
               SUM(invoice_line_items.quantity) as "total_units",
               SUM(invoice_line_items.line_total) As "total_amount_euro"
             FROM invoice
             Inner JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
             GROUP BY invoice_id
             ),
             shipment_summary AS(
               SELECT 
               shipment.id as shipment_id,
               SUM(shipment.shipping_costs) as "total_shipping",
               SUM(shipment.duty_costs) as "total_duty",
               SUM(shipment.insurance_costs) as "total_insurance",
           AVG(shipment.us_value/shipment.euro_value)::numeric as "exch_rate",
           SUM(shipment.us_value) as "total_amount_us"
             FROM shipment
             GROUP BY shipment.id
             )
             SELECT 
          EXTRACT(YEAR FROM invoice_date) as year_summary,
          total_units as total_units,
          total_amount_euro total_amount_euro,
		  ROUND(exch_rate, 3) as avg_exch_rate,
		  total_amount_us as total_amount_us,
          total_shipping as total_shipping,
          total_duty as total_duty,
          total_insurance as total_insurance,
		  total_amount_us * 0.05 as commission,
		  total_amount_us * 0.03 as misc,
		  CAST((total_units * 2.25) as money) as development
        FROM invoice_summary
          INNER JOIN shipment_invoice ON shipment_invoice.invoice_id = invoice_summary.invoice_id
          INNER JOIN shipment_summary ON shipment_summary.shipment_id = shipment_invoice.shipment_id
		)
SELECT 
	year,
	SUM(total_units),
	ROUND(AVG(total_amount_euro::numeric/total_units::numeric),2),
	ROUND(AVG((total_amount_us::numeric + total_shipping::numeric + total_duty::numeric + total_insurance::numeric + commission::numeric + misc::numeric + development::numeric)/total_units),2) as avg_landed_per_pair
FROM invoice_shipping_summary
GROUP BY year
ORDER BY year asc
      `)) as any;

    // const formattedRecords = records.map((record: any) => ({
    //   invoice_date: record.invoice_date,
    //   total_units: record.total_units,
    //   total_amount: record.total_amount ? Number.parseFloat(record.total_amount.toFixed(2)) : 0,
    //   total_disc: record.total_disc,
    //   total_shipping: record.total_shipping ?  Number.parseFloat(record.total_shipping.toFixed(2)) : 0,
    //   total_duty: record.total_duty ?  Number.parseFloat(record.total_duty.toFixed(2)) : 0,
    //   total_insurance: record.total_insurance ?  Number.parseFloat(record.total_insurance.toFixed(2)) : 0,
    // }));

    return records;
  }

  async vendorPaymentSummary() {
    let start, end;
    if (typeof this.startDate === 'string' && typeof this.endDate === 'string') {
      start = new Date(this.startDate);
      end = new Date(this.endDate);
    }
    const records = (await prisma.$queryRaw(Prisma.sql` 
    SELECT 
        payment.date_booked as date,
        vendor.name as vendor,
        payment.payment_exch_rate,
        payment_line_item.euro_payment,
        payment_line_item.usd_cost
      FROM payment
      INNER JOIN payment_line_item ON payment_line_item.payment_fk = payment.id
      INNER JOIN vendor ON payment_line_item.vendor_fk = vendor.id
      WHERE payment.date_booked >= ${start}  AND payment.date_booked <= ${end}
      ORDER BY  payment.date_booked
      `)) as any;

    return records;
  }

  async averageStyleCost(reportType: string) {
    let start, end;
    if (typeof this.startDate === 'string' && typeof this.endDate === 'string') {
      start = new Date(this.startDate).getFullYear();
      end = new Date(this.endDate).getFullYear();
    }

    const exchangePadding = this.exchangePadding! + 1;

    if (reportType === 'allTime') {
      const recordsAllTime = (await prisma.$queryRaw(Prisma.sql` 
      WITH average_cost_per_style AS (
        WITH invoice_cost_summary AS (
                SELECT 
                  invoice.id,
                   invoice.invoice_number,
                   product.product_name,
                   sum(invoice_line_items.quantity) AS total_pairs,
                   min(pairs_per_invoice.total_pairs) AS invoice_ttl_pairs,
                   round(sum(invoice_line_items.quantity)::numeric / min(pairs_per_invoice.total_pairs)::numeric, 4) AS perc_ttl_pairs,
                   avg(invoice_line_items.price::numeric)::money AS price,
                   avg(shipment.shipping_costs::numeric)::money AS shipping_cost,
                   avg(shipment.insurance_costs::numeric)::money AS insurance_cost,
                   avg(shipment.duty_costs::numeric)::money AS duty_cost,
                   round(avg((shipment.us_value / shipment.euro_value)::numeric), 3) AS ship_exch_rate
                  FROM invoice
                    JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
                    JOIN product ON product.id = invoice_line_items.product_fk
                    JOIN shipment_invoice ON shipment_invoice.invoice_id = invoice.id
                    JOIN shipment ON shipment.id = shipment_invoice.shipment_id
                    JOIN ( SELECT invoice_1.id,
                           min(invoice_1.invoice_number::text) AS min,
                           sum(invoice_line_items_1.quantity) AS total_pairs
                          FROM invoice invoice_1
                            JOIN invoice_line_items invoice_line_items_1 ON invoice_line_items_1.invoice_fk = invoice_1.id
                         GROUP BY invoice_1.id) pairs_per_invoice ON pairs_per_invoice.id = invoice.id
                 WHERE invoice_line_items.sample = false AND product.product_name::text <> 'EMPTY BOX'::text
                 GROUP BY invoice.id, invoice.invoice_number, invoice.date, product.product_name, invoice_line_items.price
               )
              SELECT 
                invoice_cost_summary.product_name,
                invoice_cost_summary.price,
                round(avg(invoice_cost_summary.ship_exch_rate), 3) AS avg_exch_rate,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${exchangePadding}::numeric AS us_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.shipping_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_shipping_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.insurance_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_insurance_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.duty_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_duty_cost,
                ${this.development}::numeric::money AS development_cost,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${this.commission}::numeric AS commission,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${this.miscellaneous}::numeric AS misc_cost,
                sum(invoice_cost_summary.total_pairs) AS total_pairs
                FROM invoice_cost_summary
              GROUP BY invoice_cost_summary.product_name, invoice_cost_summary.price
       )
        SELECT
          average_cost_per_style.product_name,
          average_cost_per_style.price,
          average_cost_per_style.avg_exch_rate,
          average_cost_per_style.us_cost,
          average_cost_per_style.avg_shipping_cost,
          average_cost_per_style.avg_insurance_cost,
          average_cost_per_style.avg_duty_cost,
          average_cost_per_style.development_cost,
          average_cost_per_style.commission,
          average_cost_per_style.misc_cost,
          average_cost_per_style.us_cost + average_cost_per_style.avg_shipping_cost + average_cost_per_style.avg_insurance_cost + average_cost_per_style.avg_duty_cost + average_cost_per_style.development_cost + average_cost_per_style.commission + average_cost_per_style.misc_cost AS landed_cost,
          average_cost_per_style.total_pairs
        FROM average_cost_per_style
        ORDER BY product_name;
        `)) as any;
  
  
        const formattedRecordsAllTime = recordsAllTime.map((record: any) => ({
          year: record.year,
          product_name: record.product_name,
          price: record.price ? Number.parseFloat(record.price.toFixed(2)) : 0,
          avg_exch_rate: record.avg_exch_rate ? Number.parseFloat(record.avg_exch_rate.toFixed(3)) : 0,
          us_cost: record.us_cost ? Number.parseFloat(record.us_cost.toFixed(2)) : 0,
          avg_shipping_cost: record.avg_shipping_cost ? Number.parseFloat(record.avg_shipping_cost.toFixed(2)) : 0,
          avg_insurance_cost: record.avg_insurance_cost ? Number.parseFloat(record.avg_insurance_cost.toFixed(2)) : 0,
          avg_duty_cost: record.avg_duty_cost ? Number.parseFloat(record.avg_duty_cost.toFixed(2)) : 0,
          development_cost: record.development_cost ? Number.parseFloat(record.development_cost.toFixed(2)) : 0,
          commission: record.commission ? Number.parseFloat(record.commission.toFixed(2)) : 0,
          misc_cost: record.misc_cost ? Number.parseFloat(record.misc_cost.toFixed(2)) : 0,
          landed_cost: record.landed_cost ? Number.parseFloat(record.landed_cost.toFixed(2)) : 0,
          total_pairs: record.total_pairs,
        }));

        return formattedRecordsAllTime;

    } else {
      const recordsByYear = (await prisma.$queryRaw(Prisma.sql` 
      WITH average_cost_per_style AS (
        WITH invoice_cost_summary AS (
                SELECT 
                  invoice.id,
                   invoice.invoice_number,
                   EXTRACT(YEAR FROM invoice.date) as "year",
                   product.product_name,
                   sum(invoice_line_items.quantity) AS total_pairs,
                   min(pairs_per_invoice.total_pairs) AS invoice_ttl_pairs,
                   round(sum(invoice_line_items.quantity)::numeric / min(pairs_per_invoice.total_pairs)::numeric, 4) AS perc_ttl_pairs,
                   avg(invoice_line_items.price::numeric)::money AS price,
                   avg(shipment.shipping_costs::numeric)::money AS shipping_cost,
                   avg(shipment.insurance_costs::numeric)::money AS insurance_cost,
                   avg(shipment.duty_costs::numeric)::money AS duty_cost,
                   round(avg((shipment.us_value / shipment.euro_value)::numeric), 3) AS ship_exch_rate
                  FROM invoice
                    JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
                    JOIN product ON product.id = invoice_line_items.product_fk
                    JOIN shipment_invoice ON shipment_invoice.invoice_id = invoice.id
                    JOIN shipment ON shipment.id = shipment_invoice.shipment_id
                    JOIN ( SELECT invoice_1.id,
                           min(invoice_1.invoice_number::text) AS min,
                           sum(invoice_line_items_1.quantity) AS total_pairs
                          FROM invoice invoice_1
                            JOIN invoice_line_items invoice_line_items_1 ON invoice_line_items_1.invoice_fk = invoice_1.id
                         GROUP BY invoice_1.id) pairs_per_invoice ON pairs_per_invoice.id = invoice.id
                 WHERE invoice_line_items.sample = false AND product.product_name::text <> 'EMPTY BOX'::text
                 GROUP BY invoice.id, invoice.invoice_number, invoice.date, product.product_name, invoice_line_items.price
               )
              SELECT 
                invoice_cost_summary.year,
                invoice_cost_summary.product_name,
                invoice_cost_summary.price,
                round(avg(invoice_cost_summary.ship_exch_rate), 3) AS avg_exch_rate,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${exchangePadding}::numeric AS us_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.shipping_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_shipping_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.insurance_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_insurance_cost,
                avg(invoice_cost_summary.perc_ttl_pairs * invoice_cost_summary.duty_cost::numeric / invoice_cost_summary.total_pairs::numeric)::money AS avg_duty_cost,
                ${this.development}::money AS development_cost,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${this.commission}::numeric AS commission,
                invoice_cost_summary.price * round(avg(invoice_cost_summary.ship_exch_rate), 3)::double precision * ${this.miscellaneous}::numeric AS misc_cost,
                sum(invoice_cost_summary.total_pairs) AS total_pairs
                FROM invoice_cost_summary
              GROUP BY invoice_cost_summary.year, invoice_cost_summary.product_name, invoice_cost_summary.price
       )
        SELECT
          average_cost_per_style.year,
          average_cost_per_style.product_name,
          average_cost_per_style.price,
          average_cost_per_style.avg_exch_rate,
          average_cost_per_style.us_cost,
          average_cost_per_style.avg_shipping_cost,
          average_cost_per_style.avg_insurance_cost,
          average_cost_per_style.avg_duty_cost,
          average_cost_per_style.development_cost,
          average_cost_per_style.commission,
          average_cost_per_style.misc_cost,
          average_cost_per_style.us_cost + average_cost_per_style.avg_shipping_cost + average_cost_per_style.avg_insurance_cost + average_cost_per_style.avg_duty_cost + average_cost_per_style.development_cost + average_cost_per_style.commission + average_cost_per_style.misc_cost AS landed_cost,
          average_cost_per_style.total_pairs
        FROM average_cost_per_style
        WHERE year >= ${start}::numeric  AND year <= ${end}::numeric
        ORDER BY year, product_name;
        `)) as any;
  
  
        const formattedRecordsByYear = recordsByYear.map((record: any) => ({
          year: record.year,
          product_name: record.product_name,
          price: record.price ? Number.parseFloat(record.price.toFixed(2)) : 0,
          avg_exch_rate: record.avg_exch_rate ? Number.parseFloat(record.avg_exch_rate.toFixed(3)) : 0,
          us_cost: record.us_cost ? Number.parseFloat(record.us_cost.toFixed(2)) : 0,
          avg_shipping_cost: record.avg_shipping_cost ? Number.parseFloat(record.avg_shipping_cost.toFixed(2)) : 0,
          avg_insurance_cost: record.avg_insurance_cost ? Number.parseFloat(record.avg_insurance_cost.toFixed(2)) : 0,
          avg_duty_cost: record.avg_duty_cost ? Number.parseFloat(record.avg_duty_cost.toFixed(2)) : 0,
          development_cost: record.development_cost ? Number.parseFloat(record.development_cost.toFixed(2)) : 0,
          commission: record.commission ? Number.parseFloat(record.commission.toFixed(2)) : 0,
          misc_cost: record.misc_cost ? Number.parseFloat(record.misc_cost.toFixed(2)) : 0,
          landed_cost: record.landed_cost ? Number.parseFloat(record.landed_cost.toFixed(2)) : 0,
          total_pairs: record.total_pairs,
        }));
  

        return formattedRecordsByYear;
    }
    
  }
}
