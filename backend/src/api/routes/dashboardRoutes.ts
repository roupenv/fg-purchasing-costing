import express, { Request, Response, NextFunction } from 'express';
const dashboardRouter = express.Router();


import { DashboardPrismaServices } from '../../services/dashboardServices';
import { DashboardController } from '../controllers/dashboardController';

const DashboardPrismaService = new DashboardPrismaServices();
const dashboard = new DashboardController(DashboardPrismaService);

dashboardRouter.get('/exchange-rate-over-time', (req, res) => dashboard.exchangeRateOverTime(req, res));

dashboardRouter.get('/transit-time', (req, res) => dashboard.transitTime(req, res));

dashboardRouter.get('/total-costs', (req, res) => dashboard.totalCosts(req, res));

dashboardRouter.get('/shipping-cost-vs-units-shipped', (req, res) =>
  dashboard.shippingCostPerUnitVersusUnitsShipped(req, res)
);

dashboardRouter.get('/metrics-summary', (req, res) => dashboard.metricsSummary(req, res));

dashboardRouter.get('/exchange-rate-today', (req: Request, res: Response) => dashboard.externalExchRateAPI(req, res));

export default dashboardRouter;
