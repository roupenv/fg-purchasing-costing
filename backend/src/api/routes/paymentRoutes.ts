import express from 'express';
const paymentsRouter = express.Router();

import { PaymentPrismaServices } from '../../services/paymentServices';
import { PaymentController } from '../controllers/paymentController';

const paymentPrismaService = new PaymentPrismaServices();
const payment = new PaymentController(paymentPrismaService);

paymentsRouter.get('/', (req, res) => payment.getAllPayments(req, res));

paymentsRouter.get('/new', (req, res) => payment.getNewPayment(req, res));

paymentsRouter.post('/new', (req, res) => payment.createNewPayment(req, res));

paymentsRouter.get('/:id', (req, res) => payment.getPayment(req, res));

paymentsRouter.delete('/:id', (req, res) => payment.deletePayment(req, res));

paymentsRouter.put('/:id', (req, res) => payment.updateEntirePayment(req, res));

paymentsRouter.get('/:id/next', (req, res) => payment.getNextRecord(req, res));

paymentsRouter.get('/:id/previous', (req, res) => payment.getPreviousRecord(req, res));

export default paymentsRouter;
