export interface DashboardInterface {
  startDate: string | undefined;
  endDate: string | undefined;
  transitTime(): Promise<unknown>;
  totalCosts(): Promise<any[][]>;
  exchangeRateOverTime(): Promise<unknown>;
  shippingCostPerUnitVersusUnitsShipped(): Promise<unknown>;
  metricsSummary(): Promise<unknown>;
}
