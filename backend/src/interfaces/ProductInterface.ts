import * as viewModel from '../models/productViewModel';

export interface ProductInterface {
  id: number | undefined;
  payload: any | undefined;
  context: any;
  getAllProducts(): Promise<viewModel.allProducts[] | undefined>;
  getProduct(): Promise<viewModel.product | undefined>;
  getNewProduct(): Promise<viewModel.product>;
  contextLink(): Promise<viewModel.contextLink[] | undefined>;
  createNewProduct(): Promise<number | undefined>;
  updateProduct(): Promise<void>;
  deleteProduct(): Promise<void>;
  getNextRecord(): Promise<viewModel.productRecord>;
  getPreviousRecord(): Promise<viewModel.productRecord>;
}
