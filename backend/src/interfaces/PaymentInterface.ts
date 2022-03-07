import * as viewModel from '../models/paymentViewModel';

export interface PaymentInterface {
  id: number | undefined;
  payload: any | undefined;
  context: any;
  getAllPayments(): Promise<viewModel.allPayments[] | undefined>;
  getPayment(): Promise<viewModel.payment>;
  getPaymentLineItems(): Promise<viewModel.paymentLineItems[] | undefined>;
  getNewPayment(): Promise<viewModel.newPayment>;
  createNewPayment(): Promise<number | undefined>;
  getNextRecord(): Promise<viewModel.record>;
  getPreviousRecord(): Promise<viewModel.record>;
  deletePayment(): Promise<void>;
  updateEntirePayment(): Promise<void>;
}
