import { Request, Response } from 'express';
import { ShipmentsInterface } from '../../interfaces/ShipmentsInterface';

export class ShipmentController {
  constructor(private shipmentService: ShipmentsInterface) {}

  async getAllShipments(req: Request, res: Response): Promise<Response> {
    const response = await this.shipmentService.getAllShipments();
    return res.status(200).json(response);
  }

  async getNewShipment(req: Request, res: Response): Promise<void> {
    const response = await this.shipmentService.getNewShipment();
    res.status(200).json(response);
  }

  async createNewShipment(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    this.shipmentService.payload = req.body;
    try {
      const response = await this.shipmentService.createNewShipment();
      res.status(201).json({ message: 'Created New Shipment Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getShipment(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    const response = await this.shipmentService.getShipment();
    res.status(200).json(response);
  }

  async updateEntireShipment(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    this.shipmentService.payload = req.body;
    try {
      const response = await this.shipmentService.updateEntireShipment();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async deleteShipment(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    try {
      const response = await this.shipmentService.deleteShipment();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.shipmentService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.shipmentService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.shipmentService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
