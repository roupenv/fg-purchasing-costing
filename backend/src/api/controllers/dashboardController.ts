import express, { Request, Response } from 'express';
import { DashboardInterface } from '../../interfaces/DashboardInterface';
import { promises as fs } from 'fs';
import axios from 'axios';

export class DashboardController {
  constructor(private dashboardService: DashboardInterface){}

  async exchangeRateOverTime(req: Request, res: Response): Promise<Response> {
    const { start, end } = req.query;
    this.dashboardService.startDate = start as string;
    this.dashboardService.endDate = end as string;
    const response = await this.dashboardService.exchangeRateOverTime();
    return res.status(200).json(response);
  }

  async transitTime(req: Request, res: Response): Promise<void> {
    const { start, end } = req.query;
    this.dashboardService.startDate = start as string;
    this.dashboardService.endDate = end as string;
    const response = await this.dashboardService.transitTime();
    res.status(200).json(response);
  }

  async totalCosts(req: Request, res: Response): Promise<void> {
    const { start, end } = req.query;
    this.dashboardService.startDate = start as string;
    this.dashboardService.endDate = end as string;
    const response = await this.dashboardService.totalCosts();
    res.status(200).json(response);
  }

  async shippingCostPerUnitVersusUnitsShipped(req: Request, res: Response): Promise<void> {
    const { start, end } = req.query;
    this.dashboardService.startDate = start as string;
    this.dashboardService.endDate = end as string;
    const response = await this.dashboardService.shippingCostPerUnitVersusUnitsShipped();
    res.status(200).json(response);
  }

  async metricsSummary(req: Request, res: Response): Promise<void> {
    const response = await this.dashboardService.metricsSummary();
    res.status(200).json(response);
  }

  async externalExchRateAPI(req: Request, res: Response): Promise<void> {
    const filePath = '/app/exchangeRateApiData.json';
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const fetchData = async () => {
      try {
        const exchRateRes = await axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/EUR`);
        await fs.writeFile(filePath, JSON.stringify(exchRateRes.data));
        console.log('File written successfully');
      } catch (error) {
        console.log(error);
      }
    };

    const fileExists = async (file: string): Promise<boolean> => {
      try {
        await fs.access(file);
        return true;
      } catch {
        return false;
      }
    };

    const readFile = async (file: string) => {
      const rawData = await fs.readFile(file, 'utf8');
      const data = JSON.parse(rawData);
      return data;
    };

    const accessField = async (file: string) => {
      const data = await readFile(file);
      return data['conversion_rates']['USD'];
    };

    try {
      if (await fileExists(filePath)) {
        const data = await readFile(filePath);
        const prevDate = new Date(data['time_last_update_utc']);
        const today = new Date();
        if (prevDate.getDate() !== today.getDate()) {
          console.log('Need to Fetch Latest Exchange Rate');
          await fetchData();
          const usdData = await accessField(filePath);
          res.json(usdData);
        } else {
          console.log('Already have latest Exchange Rate for today');
          const usdData = await accessField(filePath);
          res.json(usdData);
        }
      } else {
        console.log('File does not exist');
        await fetchData();
        const usdData = await accessField(filePath);
        res.json(usdData);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
