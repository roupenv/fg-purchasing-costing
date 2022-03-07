import TextField from '@mui/material/TextField';
import { useEffect, useState, useRef } from 'react';
import NumberFormat from 'react-number-format';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';

export default function CurrencyCell(tableObj: any, currencyPrefix: string = '$') {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;
  const cellDirty = useRef(false);

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const handleOnChange = (e: any) => {
    cellDirty.current = true;
    setInternalCellValue(e.floatValue);
  };

  const handleOnBlur = (e: any) => {
    if (cellDirty.current) {
      const numberValueOnly = Number(e.target.value.split(currencyPrefix)[1].replace(',', ''));
      dispatch({
        type: 'updatedTableCell',
        payload: {
          rowIndex: row.id,
          columnId: column.id,
          value: numberValueOnly,
        },
      });
    }
  };

  useEffect(() => {
    setInternalCellValue(initialValue);
  }, [initialValue]);

  return (
    <NumberFormat
      thousandSeparator={true}
      prefix={currencyPrefix}
      decimalScale={2}
      customInput={TextField}
      hiddenLabel
      variant='standard'
      onBlur={handleOnBlur}
      value={Number(internalCellValue).toFixed(2)}
      onValueChange={handleOnChange}
      InputProps={{
        sx: { typography: 'body2' },
        disableUnderline: !isEditMode,
        readOnly: !isEditMode,
      }}
    />
  );
}
