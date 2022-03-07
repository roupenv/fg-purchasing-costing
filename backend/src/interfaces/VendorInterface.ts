import * as viewModel from '../models/vendorViewModel';

export interface VendorInterface {
  id: number | undefined;
  payload: any | undefined;
  context: any;
  getAllVendors(): Promise<viewModel.allVendors[] | undefined>;
  getVendor(): Promise<viewModel.vendor | null>;
  getNewVendor(): Promise<viewModel.vendor>;
  contextLink(): Promise<viewModel.contextLink[] | undefined>;
  updateVendor(): Promise<void>;
  createNewVendor(): Promise<number | undefined>;
  deleteVendor(): Promise<void>;
  getNextRecord(): Promise<viewModel.vendorRecord>;
  getPreviousRecord(): Promise<viewModel.vendorRecord>;
}
