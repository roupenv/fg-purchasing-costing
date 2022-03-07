import { ResourceDetailsActions } from './actions';
import { ResourceDetailsState } from './state';

export function resourceDetailsReducer(draft: ResourceDetailsState<any>, action: ResourceDetailsActions) {
  switch (action.type) {
    case 'clickedChangeRecord': {
      if (action.payload.fetchResourceStatus === 'warning') {
        draft.status = 'alert';
        draft.alertDialog = {
          title: action.payload.dialog?.title,
          body: action.payload.dialog?.body,
        };
      }
      break;
    }
    case 'clickedCancelEdit': {
      draft.resourceData = draft.originalData;
      draft.status = 'viewing';
      break;
    }
    case 'clickedDeleteRecord': {
      draft.status = 'deleteWarning';
      break;
    }
    case 'startedNewRecord': {
      draft.status = 'editing';
      break;
    }
    case 'editedInfoField': {
      const check = (data: Record<string, any>) => {
        if ('header' in data) {
          return data.header;
        } else {
          return data;
        }
      };
      const dynamicDraft = check(draft.resourceData);
      switch (action.payload.fieldType) {
        case 'text':
          dynamicDraft[action.payload.fieldId] = action.payload.value;
          break;
        case 'number':
          dynamicDraft[action.payload.fieldId] = Number(action.payload.value);
          break;
        case 'date':
          dynamicDraft[action.payload.fieldId] = action.payload.value
            ? new Date(action.payload.value).toISOString()
            : null;
          break;
        case 'year':
          dynamicDraft[action.payload.fieldId] = action.payload.value;
          break;
        case 'select': // For MUI Select Inputs
          dynamicDraft[action.payload.fieldId] = action.payload.value;
          break;
        default:
          break;
      }
      break;
    }
    case 'updatedTableCell': {
      draft.resourceData['data'][Number(action.payload.rowIndex)][action.payload.columnId as string] =
        action.payload.value;
      break;
    }
    case 'deletedTableRow': {
      draft.resourceData['data'].splice(Number(action.payload.rowIndex), 1);

      //If User Deleted First Row of table then push new empty row
      if (Number(action.payload.rowIndex) === 0 && action.payload.value) {
        draft.resourceData['data'].push(action.payload.value);
      }
      break;
    }
    case 'addedTableRow': {
      draft.resourceData['data'].push(action.payload.value);
      break;
    }
    case 'exitedWarning': {
      draft.status = 'viewing';
      break;
    }
    case 'clickedConfirmDeleteRecord': {
      draft.status = 'alert';
      draft.alertDialog.title = action.payload.dialog?.title;
      draft.alertDialog.body = action.payload.dialog?.body;
      break;
    }
    case 'clickedCancelDeleteRecord': {
      draft.status = 'viewing';
      break;
    }
    case 'clickedEdited': {
      draft.status = 'editing';
      break;
    }
    case 'clickedSave': {
      draft.status = 'alert';
      draft.alertDialog = {
        title: action.payload.dialog?.title,
        body: action.payload.dialog?.body,
      };
      if (action.payload.fetchResourceStatus === 'success') {
        draft.originalData = draft.resourceData;
      } else {
      }
      break;
    }
    case 'saveConfirmed': {
      if (action.payload.status === 'success') {
        draft.status = 'viewing';
      } else {
        draft.status = 'editing';
      }
      break;
    }
    case 'dataFetched': {
      draft.resourceData = action.payload.dataUpdate;
      draft.originalData = action.payload.dataUpdate;
      draft.isLoading = false;
      break;
    }
    default: {
      // throw Error('Unknown action: ' + action.type);
    }
  }
}
