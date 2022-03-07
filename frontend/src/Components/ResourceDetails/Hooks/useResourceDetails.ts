import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import useFetchApi from '../../../Hooks/useFetchApi';
import useLocationHistory from '../../../Hooks/useLocationHistory';
import { ResourceDetailsActions } from '../state/actions';
import { resourceDetailsReducer } from '../state/reducer';
import { dialogInterface, initialResourceDetailsState, ResourceDetailsState } from '../state/state';
import { CustomReactTableColumn } from '../TableComponents/types/CustomReactTableColumn';

type detailTableColumns<T extends object> = CustomReactTableColumn<T>[];
type tableContext = { value: string; label: string }[] | undefined;

interface useResourceDetailsReturnType<T> {
  dispatch: React.Dispatch<ResourceDetailsActions>;
  resourceData: T;
  isLoading: boolean;
  isEditMode: boolean;
  isAlert: boolean;
  isDeleteWarning: boolean;
  endpoint: string;
  alertDialog: dialogInterface;
  originalData: T;
  defaultNewRow?: Record<string, string | number | boolean>;
  tableContext?: tableContext;
}

//Overload Function, Call Signatures
export default function useResourceDetails<T>(): useResourceDetailsReturnType<T>; //Signature
export default function useResourceDetails<T, K extends object>(
  detailTableColumns: detailTableColumns<K>,
  tableContext: tableContext
): useResourceDetailsReturnType<T>; //Signature
export default function useResourceDetails<T, K extends object>(
  detailTableColumns?: detailTableColumns<K>,
  tableContext?: tableContext
) {
  //Implementation
  const { location, currentResource, endpoint } = useLocationHistory();

  const fetchResource = '/api' + currentResource + '/' + endpoint;

  const { data } = useFetchApi<T>(fetchResource, true);

  const [state, dispatch] = useImmerReducer<ResourceDetailsState<T>, ResourceDetailsActions>(
    resourceDetailsReducer,
    initialResourceDetailsState
  );

  let defaultNewRow;
  if (detailTableColumns) {
    //Return column name
    const columnName = (data: CustomReactTableColumn<K>) =>
      typeof data.accessor === 'string' ? data.accessor : data.id;

    const columnNameDefaultValuePair = detailTableColumns
      ?.filter((column) => column.defaultValue !== undefined)
      .map((column) => [columnName(column), column.defaultValue]);

    //Construct object from Array Pairs to Key, Value
    defaultNewRow = Object.fromEntries(columnNameDefaultValuePair) as Record<string, string | number | boolean>;
  }

  useEffect(() => {
    try {
      if (data) {
        dispatch({
          type: 'dataFetched',
          payload: {
            dataUpdate: data,
          },
        });
      }
    } catch (error: any) {
      console.error(error);
    }
  }, [data, dispatch, location.pathname]);

  const { resourceData, status, isLoading, alertDialog, originalData } = state;
  const isEditMode = status === 'editing';
  const isAlert = status === 'alert';
  const isDeleteWarning = status === 'deleteWarning';

  return {
    dispatch,
    resourceData,
    isLoading,
    isEditMode,
    isAlert,
    isDeleteWarning,
    endpoint,
    alertDialog,
    originalData,
    defaultNewRow,
    tableContext,
  };
}
