import express from 'express';
const vendorsRouter = express.Router();

import { VendorPrismaServices } from '../../services/vendorServices';
import { VendorController } from '../controllers/vendorController';

const vendorPrismaService = new VendorPrismaServices();
const vendor = new VendorController(vendorPrismaService);

vendorsRouter.get('/', (req, res) => vendor.getAllVendors(req, res));

vendorsRouter.get('/new', (req, res) => vendor.getNewVendor(req, res));

vendorsRouter.post('/new', (req, res) => vendor.createNewVendor(req, res));

vendorsRouter.get('/context-link', (req, res) => vendor.contextLink(req, res));

vendorsRouter.get('/:id', (req, res) => vendor.getVendor(req, res));

vendorsRouter.put('/:id', (req, res) => vendor.updateVendor(req, res));

vendorsRouter.delete('/:id', (req, res) => vendor.deleteVendor(req, res));

vendorsRouter.get('/:id/next', (req, res) => vendor.getNextRecord(req, res));

vendorsRouter.get('/:id/previous', (req, res) => vendor.getPreviousRecord(req, res));

export default vendorsRouter;
