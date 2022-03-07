import { Request, Response } from 'express';
import { threadId } from 'worker_threads';
import { ReportsInterface } from '../../interfaces/ReportsInterface';

export class ReportsController {
  constructor(private reportsService: ReportsInterface) {}

  async getAvgShipCost(req: Request, res: Response): Promise<Response> {
    const response = await this.reportsService.averageShippingCosts();
    return res.status(200).json(response);
  }

  async getYearlySummary(req: Request, res: Response): Promise<Response> {
    const { start, end } = req.query;
    this.reportsService.startDate = start as string;
    this.reportsService.endDate = end as string;
    const response = await this.reportsService.yearSummary();
    return res.status(200).json(response);
  }

  async getYearAvgOfSum(req: Request, res: Response): Promise<Response> {
    const { commission, miscellaneous, exchangePadding, development } = req.query;
    this.reportsService.commission = Number(commission);
    this.reportsService.miscellaneous = Number(miscellaneous);
    this.reportsService.exchangePadding = Number(exchangePadding);
    this.reportsService.development = Number(development);
    const response = await this.reportsService.yearAvgOfSum();
    return res.status(200).json(response);
  }

  async getVendorPaymentSummary(req: Request, res: Response): Promise<Response> {
    const { start, end } = req.query;
    this.reportsService.startDate = start as string;
    this.reportsService.endDate = end as string;
    const response = await this.reportsService.vendorPaymentSummary();
    return res.status(200).json(response);
  }

  async getAvgStyleCost(req: Request, res: Response): Promise<Response> {
    const { reportType, start, end, commission, miscellaneous, exchangePadding, development } = req.query;

    this.reportsService.startDate = start as string;
    this.reportsService.endDate = end as string;
    this.reportsService.commission = Number(commission);
    this.reportsService.miscellaneous = Number(miscellaneous);
    this.reportsService.exchangePadding = Number(exchangePadding);
    this.reportsService.development = Number(development);
    const response = await this.reportsService.averageStyleCost(reportType as string);
    return res.status(200).json(response);
  }
}
