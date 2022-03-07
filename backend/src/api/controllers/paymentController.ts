import { Request, Response } from 'express';
import { PaymentInterface } from '../../interfaces/PaymentInterface';

export class PaymentController {
  constructor(private paymentService: PaymentInterface) {}

  async getAllPayments(req: Request, res: Response): Promise<Response> {
    const response = await this.paymentService.getAllPayments();
    return res.status(200).json(response);
  }

  async getNewPayment(req: Request, res: Response): Promise<void> {
    const response = await this.paymentService.getNewPayment();
    res.status(200).json(response);
  }

  async createNewPayment(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    this.paymentService.payload = req.body;
    try {
      const response = await this.paymentService.createNewPayment();
      res.status(201).json({ message: 'Created New Payment Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPayment(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    const response = await this.paymentService.getPayment();
    res.status(200).json(response);
  }

  async updateEntirePayment(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    this.paymentService.payload = req.body;
    try {
      const response = await this.paymentService.updateEntirePayment();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    try {
      const response = await this.paymentService.deletePayment();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.paymentService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.paymentService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.paymentService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
