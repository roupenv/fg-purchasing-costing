import express, { Application } from 'express';
import morgan from 'morgan';

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';

import invoicesRouter from './api/routes/invoiceRoutes';
import shipmentsRouter from './api/routes/shipmentRoutes';
import productsRouter from './api/routes/productRoutes';
import paymentsRouter from './api/routes/paymentRoutes';
import dashboardRouter from './api/routes/dashboardRoutes';
import vendorsRouter from './api/routes/vendorRoutes';
import tarrifsRouter from './api/routes/tarrifRoutes';
import reportsRouter from './api/routes/reportsRoutes';
import userRouter from './api/routes/userRoutes';
import { errorHandler } from './api/middlewares/error';
import { isAuth } from './api/middlewares/auth';
import { adminProtected } from './api/middlewares/adminProtected';

export const app: Application = express();

//Middleware
app.use(morgan('dev'));
app.use(express.json()); // for parsing application/json
app.use('/api/login/', userRouter);

//All Endpoints need to be authenticated
app.use('/api', isAuth);

//Admin Role Protected Endpoints
app.use('/api/dashboard', adminProtected, dashboardRouter);
app.use('/api/reports', adminProtected, reportsRouter);

//Regular Authenticated Endpoints
app.use('/api/invoices', invoicesRouter);
app.use('/api/shipments', shipmentsRouter);
app.use('/api/products', productsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/tarrifs', tarrifsRouter);

//Error Handler
app.use(errorHandler);

//If App is running in Production Environment, use React compiled production Build and serve React SPA App on "/*" endpoint
// Else just send respond that running in Development
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Running In Development');
  });
}
