import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';

export default function PercentageCell(tableObj: any, decimalScale: number = 2) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;
  const [internalCellValue, setInternalCellValue] = useState(initialValue);

  const handleOnChange = (e: any) => {
    setInternalCellValue(Number(e.floatValue) / 100);
  };

  const handleOnBlur = (e: any) => {
    const percentageToDecimal = e.target.value.split('%')[0] / 100;
    dispatch({
      type: 'updatedTableCell',
      payload: {
        rowIndex: row.id,
        columnId: column.id,
        value: Number(percentageToDecimal),
      },
    });
  };

  useEffect(() => {
    setInternalCellValue(initialValue);
  }, [initialValue]);

  return (
    // <NumberFormat customInput={TextField} format='#### #### #### ####' />
    <NumberFormat
      customInput={TextField}
      suffix={'%'}
      decimalScale={decimalScale}
      value={Number(internalCellValue) * 100}
      onValueChange={handleOnChange}
      hiddenLabel
      variant='standard'
      color='primary'
      onBlur={handleOnBlur}
      InputProps={{
        sx: { typography: 'body2', padding: '0' },
        disableUnderline: !isEditMode,
        readOnly: !isEditMode,
      }}
    />
  );
}
