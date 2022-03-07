import { useMemo } from 'react';
import useFetchApi from './useFetchApi';

function tempLoadingColumns(arrOfObj: any, columns: any): any {
  if (arrOfObj === undefined) {
    return [
      {
        accessor: 'col1', // accessor is the "key" in the data
      },
    ];
  } else {
    return columns;
  }
}

function splitDateColumn(arrOfObj: Record<string, any>, dateColumnAccessor: string) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const newArrOfObj = arrOfObj.map((obj: any) => {
    const dateToSplit = new Date(obj[dateColumnAccessor]);
    const [month, monthIndex, day, year] = [
      monthNames[dateToSplit.getMonth()],
      dateToSplit.getMonth(),
      dateToSplit.getDate(),
      dateToSplit.getFullYear(),
    ];
    const dateSummary = `${month} ${day}, ${year}`;
    return { monthIndex, month, day, year, dateSummary, ...obj };
  });

  return newArrOfObj;
}

interface ITableData {
  data: Record<string, any>
}

type ISummaryData = Record<string,any>

export function useFetchTableData<T extends ITableData | ISummaryData>(
  resource: string,
  tableColumns: any,
  dateColumnToSplit?: string
): [fetchData: T, columns: any, loading: boolean] {
  const initialData: ITableData= { data: [{ col1: '' }] };
  const { data: fetchData, loading } = useFetchApi(resource, true, undefined, initialData);

  const data: T = useMemo(
    () => (dateColumnToSplit && !loading ? splitDateColumn(fetchData!, dateColumnToSplit) : fetchData),
    [fetchData, dateColumnToSplit, loading]
  );
  const columns = useMemo(() => tempLoadingColumns(data, tableColumns), [data, tableColumns]);

  return [data, columns, loading];
}
