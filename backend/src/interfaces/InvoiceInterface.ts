import * as viewModel from '../models/invoiceViewModel';

export interface InvoiceInterface {
  id: number | undefined;
  payload: any | undefined;
  getAllInvoices(): Promise<viewModel.allInvoices[]>;
  getInvoice(): Promise<viewModel.invoice>;
  getInvoiceLineItems(): Promise<viewModel.invoiceLineItems[] | undefined>;
  contextLink(): Promise<viewModel.contextLink[]>;
  getNextRecord(): Promise<viewModel.invoiceRecord>;
  getPreviousRecord(): Promise<viewModel.invoiceRecord>;
  getNewInvoice(): Promise<viewModel.invoice>;
  createNewInvoice(): Promise<number| undefined>;
  updateEntireInvoice(): Promise<void>;
  deleteInvoice(): Promise<void>;
}
