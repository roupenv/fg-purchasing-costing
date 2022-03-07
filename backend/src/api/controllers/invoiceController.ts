import express, { Request, Response } from 'express';
import { InvoiceInterface } from '../../interfaces/InvoiceInterface';

export class InvoiceController {
  constructor(private invoiceService: InvoiceInterface) {}

  async getAllInvoices(req: Request, res: Response): Promise<Response> {
    const response = await this.invoiceService.getAllInvoices();
    return res.status(200).json(response);
  }

  async getNewInvoice(req: Request, res: Response): Promise<void> {
    const response = await this.invoiceService.getNewInvoice();
    res.status(200).json(response);
  }

  async createNewInvoice(req: Request, res: Response): Promise<void> {
    this.invoiceService.payload = req.body;
    try {
      const response = await this.invoiceService.createNewInvoice();
      res.status(201).json({ message: 'Created New Invoice Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async contextLink(req: Request, res: Response): Promise<void> {
    const response = await this.invoiceService.contextLink();
    res.status(200).json(response);
  }

  async getInvoice(req: Request, res: Response): Promise<void> {
    this.invoiceService.id = Number(req.params.id);
    const response = await this.invoiceService.getInvoice();
    res.status(200).json(response);
  }

  async updateEntireInvoice(req: Request, res: Response): Promise<void> {
    this.invoiceService.id = Number(req.params.id);
    this.invoiceService.payload = req.body;
    try {
      const response = await this.invoiceService.updateEntireInvoice();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async deleteInvoice(req: Request, res: Response): Promise<void> {
    this.invoiceService.id = Number(req.params.id);
    try {
      const response = await this.invoiceService.deleteInvoice();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.invoiceService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.invoiceService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.invoiceService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.invoiceService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
