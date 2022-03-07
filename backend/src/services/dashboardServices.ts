import { prisma, Prisma } from './prismaClient';
import Services from './baseServicesClass';
import { DashboardInterface } from '../interfaces/DashboardInterface';

export class DashboardPrismaServices extends Services implements DashboardInterface {
  startDate: string | undefined;
  endDate: string | undefined;
  constructor(startDate: string | undefined = undefined, endDate: string | undefined = undefined) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
  }

  async transitTime() {
    const dateStart = new Date(this.startDate as string);
    const dateEnd = new Date(this.endDate as string);

    const records = await prisma.$queryRaw(Prisma.sql`
    WITH filtered_dates as (
      SELECT 
        arrival_date,
        departure_date,
        arrival_date::date - departure_date::date as delivery_days
      FROM shipment
      WHERE arrival_date >= ${dateStart} AND arrival_date<= ${dateEnd} 
          AND (arrival_date IS NOT NULL OR departure_date IS NOT NULL)
    ),
    histogram_series as (
      SELECT * 
      FROM generate_series(
                (SELECT MIN(arrival_date::date - departure_date::date) FROM filtered_dates),
                (SELECT MAX(arrival_date::date - departure_date::date) FROM filtered_dates)
                ) as delivery_days
    ),
    avg_delivery_days as(
    SELECT 
        ROUND(AVG(arrival_date::date - departure_date::date),2) as avg_delivery_days 
        FROM filtered_dates
        ),
    median_delivery_days as(
          SELECT 
          PERCENTILE_CONT(0.5) WITHIN GROUP(ORDER BY arrival_date::date - departure_date::date) as median_delivery_days
          FROM filtered_dates
        )
    SELECT 
        histogram_series.delivery_days,
          COUNT(filtered_dates.delivery_days) as number_instances,
          MIN(avg_delivery_days) as avg_delivery_days,
          MIN(median_delivery_days) as median_delivery_days
        FROM filtered_dates
      FULL OUTER JOIN 
        histogram_series ON histogram_series.delivery_days = filtered_dates.delivery_days 
        CROSS JOIN avg_delivery_days 
        CROSS JOIN median_delivery_days
        GROUP BY histogram_series.delivery_days
        ORDER BY histogram_series.delivery_days
    `);
    return records;
  }

  async totalCosts() {
    const dateStart = new Date(this.startDate as string);
    const dateEnd = new Date(this.endDate as string);

    const records: Array<any> = await prisma.$queryRaw(Prisma.sql`
    WITH total_costs_summary as (
      WITH total_shipping_costs as (
      SELECT 
      EXTRACT(YEAR FROM arrival_date) as ship_year,
      EXTRACT(MONTH FROM arrival_date) as ship_month,
      SUM(shipping_costs) as total_shipping_costs,
      SUM(duty_costs) as total_duty_costs
    
      FROM shipment
      WHERE shipment.arrival_date IS NOT NULL OR shipment.departure_date IS NOT NULL
      GROUP BY ship_month, ship_year
      ),
      total_invoice_costs as (
      SELECT
      EXTRACT(YEAR FROM date) as invoice_year,
      EXTRACT(MONTH FROM date) as invoice_month,
      SUM(quantity) as total_units,
      SUM(line_total)as total_unit_cost
    
      FROM invoice
      INNER JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
      GROUP BY invoice_month, invoice_year
      )
      SELECT 
        COALESCE(invoice_year, ship_year) as year,
        COALESCE(invoice_month, ship_month) as month,
        total_units,
        total_unit_cost,
        total_shipping_costs,
        total_duty_costs
      FROM total_invoice_costs
      FULL OUTER JOIN total_shipping_costs ON total_shipping_costs.ship_year = total_invoice_costs.invoice_year AND  total_shipping_costs.ship_month = total_invoice_costs.invoice_month 
    -- 	WHERE COALESCE(invoice_year, ship_year) = 2021
      ORDER BY year, month
      ),
    all_dates as (
      WITH all_months as (
      SELECT *
      FROM generate_series (
        (SELECT MIN(total_costs_summary.month) FROM total_costs_summary)::int,
        (SELECT MAX(total_costs_summary.month) FROM total_costs_summary)::int) as all_months
      ),
    all_years as (
      SELECT *
      FROM generate_series (
        (SELECT MIN(total_costs_summary.year) FROM total_costs_summary)::int,
        (SELECT MAX(total_costs_summary.year) FROM total_costs_summary)::int) as all_years
      )  
    SELECT * 
      FROM all_years
      CROSS JOIN all_months
    )
    SELECT 
      all_years as year,
      TO_CHAR(TO_DATE (all_months::text, 'MM'), 'Mon') AS month,
      all_months as month_num,
      COALESCE(total_units, 0) as total_units,
      COALESCE(total_unit_cost, 0::money) as total_unit_cost,
      COALESCE(total_shipping_costs, 0::money) as total_shipping_costs,
      COALESCE(total_duty_costs, 0::money) as total_duty_costs	
    FROM total_costs_summary
    FULL OUTER JOIN all_dates ON all_dates.all_years = total_costs_summary.year AND all_dates.all_months = total_costs_summary.month
    WHERE all_years >= ${dateStart.getFullYear()} AND all_years <= ${dateEnd.getFullYear()} 
    ORDER BY year DESC, month_num ASC;
    `);
    const distinctYears = Array.from(new Set(records.map((item) => item.year)));
    const totalCostsByYear = distinctYears.map((year) => records.filter((item) => item.year === year));

    return totalCostsByYear;
  }

  async exchangeRateOverTime() {
    const dateStart = new Date(this.startDate as string);
    const dateEnd = new Date(this.endDate as string);
    const records = await prisma.$queryRaw(Prisma.sql`
    WITH filtered_payments as (
      SELECT 
         ROUND(payment_exch_rate::numeric,3) as exchange_rate,
        date_booked::date as date,
       EXTRACT(YEAR FROM date_booked) as year,
       EXTRACT(MONTH FROM date_booked) as month
     FROM payment
     WHERE payment_exch_rate > 0 AND (date_booked >=${dateStart} AND date_booked <= ${dateEnd})
   ),
    time_series as (
    SELECT all_dates::date,
        EXTRACT(YEAR FROM all_dates) as years,
        EXTRACT(MONTH FROM all_dates) as months
    FROM generate_series
            ( (SELECT MIN(date) FROM filtered_payments)
            , (SELECT MAX(date) FROM filtered_payments)
            , '1 month'::interval) as all_dates
    ) 
    SELECT 
      CONCAT (time_series.years,'-', time_series.months) as year_month,
      ROUND(AVG(filtered_payments.exchange_rate), 3)  as exchange_rate
    FROM time_series
    FULL OUTER JOIN filtered_payments ON filtered_payments.year = time_series.years
    AND filtered_payments.month = time_series.months
    GROUP BY time_series.years, time_series.months
    ORDER BY time_series.years,	time_series.months
      `);
    return records;
  }

  async shippingCostPerUnitVersusUnitsShipped() {
    const dateStart = new Date(this.startDate as string);
    const dateEnd = new Date(this.endDate as string);

    const records = await prisma.$queryRaw(Prisma.sql`
    SELECT 
      arrival_date::date,
      ROUND((shipping_costs/units_shipped)::numeric,2) as shipping_cost_per_unit,
      units_shipped
    FROM shipment
    WHERE shipment.trans_method = 'AIR' AND (arrival_date >= ${dateStart} AND arrival_date<= ${dateEnd})
    ORDER BY arrival_date ASC 
      `);
    return records;
  }

  async metricsSummary() {
    const dateStart = new Date(this.startDate as string);
    const dateEnd = new Date(this.endDate as string);

    const records = await prisma.$queryRaw(Prisma.sql`
    SELECT 
        EXTRACT(YEAR from invoice.date) as year,
        ROUND(SUM(invoice_line_items.line_total::numeric),0) as total_purchases,
        SUM(invoice_line_items.quantity)::integer as total_units
      FROM invoice
      INNER JOIN invoice_line_items ON invoice_line_items.invoice_fk = invoice.id
      GROUP BY year
      ORDER BY YEAR DESC
      `);
    return records;
  }
}
