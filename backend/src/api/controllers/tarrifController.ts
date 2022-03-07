import { Request, Response } from 'express';
import { TarrifInterface } from '../../interfaces/TarrifInterface';

export class TarrifController {
  constructor(private tarrifService: TarrifInterface) {}

  async getAllTarrifs(req: Request, res: Response): Promise<Response> {
    const response = await this.tarrifService.getAllTarrifs();
    return res.status(200).json(response);
  }

  async getTarrif(req: Request, res: Response): Promise<void> {
    this.tarrifService.id = Number(req.params.id);
    this.tarrifService.payload = req.body;
    try {
      const response = await this.tarrifService.getTarrif();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNewTarrif(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.tarrifService.getNewTarrif();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createNewTarrif(req: Request, res: Response): Promise<void> {
    this.tarrifService.payload = req.body;
    try {
      const response = await this.tarrifService.createNewTarrif();
      res.status(201).json({ message: 'Created New Tarrif Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async contextLink(req: Request, res: Response): Promise<void> {
    const response = await this.tarrifService.contextLink();
    res.status(200).json(response);
  }

  async deleteTarrif(req: Request, res: Response): Promise<void> {
    this.tarrifService.payload = req.body;
    try {
      const response = await this.tarrifService.deleteTarrif();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateTarrif(req: Request, res: Response): Promise<void> {
    this.tarrifService.id = Number(req.params.id);
    this.tarrifService.payload = req.body;
    try {
      const response = await this.tarrifService.updateTarrif();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.tarrifService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.tarrifService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.tarrifService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.tarrifService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
