import React, { useMemo } from 'react';


export default function ColumnSumFooter({ column, rows }: any, formatter: Intl.NumberFormat | undefined  = undefined) {
  const total = useMemo(
    () => rows.reduce((sum: number, row: any): number => Number(row.values[column.id]) + sum, 0),
    [rows, column.id]
  );    
  if (typeof formatter === 'undefined') {
    return <b>{total}</b>;
  } else {
    return <b>{formatter.format(total)}</b>;
  }
}
