import * as viewModel from '../models/reportsViewModel';

export interface ReportsInterface {
  startDate: string | undefined 
  endDate:  string | undefined 
  commission:  number | undefined;
  miscellaneous: number | undefined;
  exchangePadding: number | undefined;
  development: number | undefined;
  averageShippingCosts(): Promise<viewModel.averageShippingCosts[]>
  yearSummary(): Promise<any>
  yearAvgOfSum(): Promise<any>
  vendorPaymentSummary(): Promise<any>
  averageStyleCost(reportType: string): Promise<any>
}
