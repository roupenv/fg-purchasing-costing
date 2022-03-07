import express from 'express';
const shipmentsRouter = express.Router();

import { ShipmentPrismaService } from '../../services/shipmentServices';
import { ShipmentController } from '../controllers/shipmentController';

const shipmentPrismaService = new ShipmentPrismaService();
const shipment = new ShipmentController(shipmentPrismaService);

shipmentsRouter.get('/', (req, res) => shipment.getAllShipments(req, res));

shipmentsRouter.get('/new', (req, res) => shipment.getNewShipment(req, res));

shipmentsRouter.post('/new', (req, res) => shipment.createNewShipment(req, res));

shipmentsRouter.get('/:id', (req, res) => shipment.getShipment(req, res));

shipmentsRouter.put('/:id', (req, res) => shipment.updateEntireShipment(req, res));

shipmentsRouter.delete('/:id', (req, res) => shipment.deleteShipment(req, res));

shipmentsRouter.get('/:id/next', (req, res) => shipment.getNextRecord(req, res));

shipmentsRouter.get('/:id/previous', (req, res) => shipment.getPreviousRecord(req, res));

export default shipmentsRouter;
