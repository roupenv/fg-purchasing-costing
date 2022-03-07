import * as viewModel from '../models/tarrifViewModel';

export interface TarrifInterface {
  id: number | undefined;
  payload: any | undefined;
  context: any;
  getAllTarrifs(): Promise<viewModel.allTarrifs[] | undefined>;
  getTarrif(): Promise<viewModel.tarrif | null>
  getNewTarrif(): Promise<viewModel.tarrif>
  contextLink(): Promise<viewModel.contextLink[] | undefined>;
  updateTarrif(): Promise<void>;
  createNewTarrif(): Promise<number | undefined>
  deleteTarrif(): Promise<void>;
  getNextRecord(): Promise<viewModel.tarrifRecord>;
  getPreviousRecord(): Promise<viewModel.tarrifRecord>;
}
