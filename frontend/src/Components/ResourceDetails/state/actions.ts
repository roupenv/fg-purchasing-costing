import { dialogInterface } from './state';

interface resourcePayload {
  nextResource?: string;
  previousResource?: string;
  currentResourceId?: number;
  fetchResourceStatus?: 'success' | 'warning' | 'error';
  dialog?: dialogInterface;
}

interface infoCardPayload {
  fieldType: 'text' | 'number' | 'date' | 'year' | 'select';
  fieldId: string;
  value: string | number | Date | null;
}

interface tablePayload {
  rowIndex?: string | number;
  columnId?: string;
  value?: string | number | Record<string, any>;
}

interface savePayload {
  status: 'success' | 'error'
}


export interface startedNewRecord {
  type: 'startedNewRecord';
}
export interface saveConfirmed {
  type: 'saveConfirmed';
  payload: savePayload
}

export interface clickedChangeRecord {
  type: 'clickedChangeRecord';
  payload: resourcePayload;
}

export interface clickedDeleteRecord {
  type: 'clickedDeleteRecord';
}

export interface exitedWarning {
  type: 'exitedWarning';
}

export interface clickedConfirmDeleteRecord {
  type: 'clickedConfirmDeleteRecord';
  payload: resourcePayload;
}

export interface clickedCancelDeleteRecord {
  type: 'clickedCancelDeleteRecord';
}

export interface clickedEdited {
  type: 'clickedEdited';
}

export interface clickedCancelEdit {
  type: 'clickedCancelEdit';
}

export interface clickedSave {
  type: 'clickedSave';
  payload: resourcePayload;
}

export interface editedInfoField {
  type: 'editedInfoField';
  payload: infoCardPayload;
}

export interface updatedTableCell {
  type: 'updatedTableCell';
  payload: tablePayload;
}

export interface deletedTableRow {
  type: 'deletedTableRow';
  payload: tablePayload;
}

export interface addedTableRow {
  type: 'addedTableRow';
  payload: tablePayload;
}

export interface dataFetched {
  type: 'dataFetched';
  payload: any;
}

export type ResourceDetailsActions =
  | startedNewRecord
  | clickedChangeRecord
  | clickedDeleteRecord
  | exitedWarning
  | clickedConfirmDeleteRecord
  | clickedCancelDeleteRecord
  | clickedEdited
  | clickedCancelEdit
  | clickedSave
  | editedInfoField
  | updatedTableCell
  | deletedTableRow
  | addedTableRow
  | dataFetched
  | saveConfirmed;
