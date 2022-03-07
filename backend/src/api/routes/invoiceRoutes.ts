import express from 'express';
const invoicesRouter = express.Router();

import { InvoicePrismaServices } from '../../services/invoiceServices';
import { InvoiceController } from '../controllers/invoiceController';

const invoicePrismaService = new InvoicePrismaServices();
const invoice = new InvoiceController(invoicePrismaService);

invoicesRouter.get('/', (req, res) => invoice.getAllInvoices(req, res));

invoicesRouter.get('/new', (req, res) => invoice.getNewInvoice(req, res));

invoicesRouter.post('/new', (req, res) => invoice.createNewInvoice(req, res));

invoicesRouter.get('/context-link', (req, res) => invoice.contextLink(req, res));

invoicesRouter.get('/:id', (req, res) => invoice.getInvoice(req, res));

invoicesRouter.put('/:id', (req, res) => invoice.updateEntireInvoice(req, res));

invoicesRouter.delete('/:id', (req, res) => invoice.deleteInvoice(req, res));

invoicesRouter.get('/:id/next', (req, res) => invoice.getNextRecord(req, res));

invoicesRouter.get('/:id/previous', (req, res) => invoice.getPreviousRecord(req, res));

export default invoicesRouter;
