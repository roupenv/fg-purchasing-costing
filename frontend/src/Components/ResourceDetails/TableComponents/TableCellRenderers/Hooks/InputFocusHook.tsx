import { useEffect, useRef } from 'react';

export default function useInputFocus(tableObj: any) {
  const { allColumns, column, rows, row } = tableObj;

  const currentRowIndex = row.index;
  const rowsLength = rows.length;
  const columnId = column.id;
  const arrOfColumnIds = allColumns.map((column: any) => column.id);
  const columnIndex = arrOfColumnIds.findIndex((column: any) => column === columnId);


  const inputFocusElement = useRef<any>();

  useEffect(() => {
    if (currentRowIndex === rowsLength - 1 && columnIndex === 0) {
      inputFocusElement.current?.focus();
    }
  }, [columnIndex, currentRowIndex, rowsLength]);

  return inputFocusElement
}
