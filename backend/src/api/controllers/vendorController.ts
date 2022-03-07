import { Request, Response } from 'express';
import { VendorInterface } from '../../interfaces/VendorInterface';

export class VendorController {
  constructor(private vendorService: VendorInterface) {}

  async getAllVendors(req: Request, res: Response): Promise<Response> {
    const response = await this.vendorService.getAllVendors();
    return res.status(200).json(response);
  }

  async getVendor(req: Request, res: Response): Promise<void> {
    this.vendorService.id = Number(req.params.id);
    this.vendorService.payload = req.body;
    try {
      const response = await this.vendorService.getVendor();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNewVendor(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.vendorService.getNewVendor();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createNewVendor(req: Request, res: Response): Promise<void> {
    this.vendorService.payload = req.body;
    try {
      const response = await this.vendorService.createNewVendor();
      res.status(201).json({ message: 'Created New Vendor Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async contextLink(req: Request, res: Response): Promise<void> {
    const response = await this.vendorService.contextLink();
    res.status(200).json(response);
  }

  async deleteVendor(req: Request, res: Response): Promise<void> {
    this.vendorService.id = Number(req.params.id);
    this.vendorService.payload = req.body;
    try {
      const response = await this.vendorService.deleteVendor();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateVendor(req: Request, res: Response): Promise<void> {
    this.vendorService.payload = req.body;
    try {
      const response = await this.vendorService.updateVendor();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.vendorService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.vendorService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.vendorService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.vendorService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
