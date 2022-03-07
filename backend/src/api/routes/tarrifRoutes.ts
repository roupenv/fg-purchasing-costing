import express from 'express';
const tarrifsRouter = express.Router();

import { TarrifPrismaServices } from '../../services/tarrifServices';
import { TarrifController } from '../controllers/tarrifController';

const tarrifPrismaService = new TarrifPrismaServices();
const tarrif = new TarrifController(tarrifPrismaService);

tarrifsRouter.get('/', (req, res) => tarrif.getAllTarrifs(req, res));

tarrifsRouter.get('/new', (req, res) => tarrif.getNewTarrif(req, res));

tarrifsRouter.post('/new', (req, res) => tarrif.createNewTarrif(req, res));

tarrifsRouter.get('/context-link', (req, res) => tarrif.contextLink(req, res));

tarrifsRouter.get('/:id', (req, res) => tarrif.getTarrif(req, res));

tarrifsRouter.put('/:id', (req, res) => tarrif.updateTarrif(req, res));

tarrifsRouter.delete('/:id', (req, res) => tarrif.deleteTarrif(req, res));

tarrifsRouter.get('/:id/next', (req, res) => tarrif.getNextRecord(req, res));

tarrifsRouter.get('/:id/previous', (req, res) => tarrif.getPreviousRecord(req, res));

export default tarrifsRouter;
