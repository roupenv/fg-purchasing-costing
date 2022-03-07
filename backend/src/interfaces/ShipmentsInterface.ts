import { shipment } from '.prisma/client';
import * as viewModel from '../models/shipmentsViewModel';

export interface ShipmentsInterface {
  id: number | undefined;
  payload: any | undefined;
  context: any;
  getAllShipments(): Promise<viewModel.allShipments[]>;
  getShipment(): Promise<viewModel.shipment>;
  getShipmentDutyLines(): Promise<viewModel.shipmentDutyLineItems[] | undefined>;
  getNextRecord(): Promise<viewModel.shipmentRecord>;
  getPreviousRecord(): Promise<viewModel.shipmentRecord>;
  getNewShipment(): Promise<viewModel.shipment>;
  createNewShipment(): Promise<number | undefined>;
  updateEntireShipment(): Promise<void>;
  deleteShipment(): Promise<void>;
  getRelatedInvoiceId(arg0: string): Promise<number | undefined>;
}
