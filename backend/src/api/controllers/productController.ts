import { Request, Response } from 'express';
import { ProductInterface } from '../../interfaces/ProductInterface';

export class ProductController {
  constructor(private productService: ProductInterface) {}

  async getAllProducts(req: Request, res: Response): Promise<Response> {
    const response = await this.productService.getAllProducts();
    return res.status(200).json(response);
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    this.productService.id = Number(req.params.id);
    this.productService.payload = req.body;
    try {
      const response = await this.productService.getProduct();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getNewProduct(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.productService.getNewProduct();
      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async contextLink(req: Request, res: Response): Promise<void> {
    const response = await this.productService.contextLink();
    res.status(200).json(response);
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    this.productService.id = Number(req.params.id);
    this.productService.payload = req.body;
    try {
      const response = await this.productService.deleteProduct();
      res.status(201).json({ message: 'Deleted Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async createNewProduct(req: Request, res: Response): Promise<void> {
    this.productService.payload = req.body;
    try {
      const response = await this.productService.createNewProduct();
      res.status(201).json({ message: 'Created New Product Successfully', newId: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    this.productService.payload = req.body;
    try {
      const response = await this.productService.updateProduct();
      res.status(201).json({ message: 'Updated Successfully' });
    } catch (error: any) {
      res.status(400).json({ message: 'Could Not Update: ' + error.message });
    }
  }

  async getNextRecord(req: Request, res: Response): Promise<void> {
    this.productService.id = Number(req.params.id);
    try {
      const nextInvoice = await this.productService.getNextRecord();
      res.status(200).json(nextInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPreviousRecord(req: Request, res: Response): Promise<void> {
    this.productService.id = Number(req.params.id);
    try {
      const prevInvoice = await this.productService.getPreviousRecord();
      res.status(200).json(prevInvoice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
