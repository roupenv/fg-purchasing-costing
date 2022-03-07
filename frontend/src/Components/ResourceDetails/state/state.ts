export interface ResourceDetailsState<T> {
  resourceData: T;
  originalData: T;
  status: status;
  isLoading: boolean;
  alertDialog: dialogInterface;
}

export interface dialogInterface {
  title?: string;
  body?: string;
}

type status = 'editing' | 'viewing' | 'canceled' | 'saved' | 'deleteWarning' | 'alert';

export const initialResourceDetailsState: ResourceDetailsState<any> = {
  resourceData: {},
  originalData: {},
  status: 'viewing',
  isLoading: true,
  alertDialog: {},
};
