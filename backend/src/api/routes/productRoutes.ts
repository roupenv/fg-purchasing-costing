import express from 'express';
const productsRouter = express.Router();

import { ProductPrismaServices } from '../../services/productServices';
import { ProductController } from '../controllers/productController';

const productPrismaService = new ProductPrismaServices();
const product = new ProductController(productPrismaService);

productsRouter.get('/', (req, res) => product.getAllProducts(req, res));

productsRouter.get('/new', (req, res) => product.getNewProduct(req, res));

productsRouter.post('/new', (req, res) => product.createNewProduct(req, res));

productsRouter.get('/context-link', (req, res) => product.contextLink(req, res));

productsRouter.get('/:id', (req, res) => product.getProduct(req, res));

productsRouter.put('/:id', (req, res) => product.updateProduct(req, res));

productsRouter.delete('/:id', (req, res) => product.deleteProduct(req, res));

productsRouter.get('/:id/next', (req, res) => product.getNextRecord(req, res));

productsRouter.get('/:id/previous', (req, res) => product.getPreviousRecord(req, res));

export default productsRouter;
