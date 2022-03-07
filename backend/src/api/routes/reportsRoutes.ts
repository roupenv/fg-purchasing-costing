import express from 'express';
const reportsRouter = express.Router();

import { ReportsPrismaServices } from '../../services/reportsServices';
import { ReportsController } from '../controllers/reportsController';

const reportsPrismaService = new ReportsPrismaServices();
const reports = new ReportsController(reportsPrismaService);

reportsRouter.get('/avg-ship-cost', (req, res) => reports.getAvgShipCost(req, res));

reportsRouter.get('/yearly-summary', (req, res) => reports.getYearlySummary(req, res));

reportsRouter.get('/yearly-avg-summary', (req, res) => reports.getYearAvgOfSum(req, res));

reportsRouter.get('/vendor-payment-summary', (req, res) => reports.getVendorPaymentSummary(req, res));

reportsRouter.get('/avg-style-cost', (req, res) => reports.getAvgStyleCost(req, res));


export default reportsRouter;
