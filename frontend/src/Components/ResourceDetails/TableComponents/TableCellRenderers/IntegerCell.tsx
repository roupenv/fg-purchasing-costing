import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';

export default function IntegerCell(tableObj: any) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const cellDirty = useRef(false);

  const handleOnChange = (e: any) => {
    cellDirty.current = true;
    setInternalCellValue(e.floatValue);
  };
  
  const handleOnBlur = (e: any) => {
    if (cellDirty.current){
      dispatch({
        type: 'updatedTableCell',
        payload: {
          rowIndex: row.id,
          columnId: column.id,
          value: Number(e.target.value.replace(',', '')),
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
      decimalScale={0}
      customInput={TextField}
      hiddenLabel
      variant='standard'
      color='primary'
      onBlur={handleOnBlur}
      value={Number(internalCellValue)}
      onValueChange={handleOnChange}
      InputProps={{
        sx: { typography: 'body2', padding: '0' },
        disableUnderline: !isEditMode,
        readOnly: !isEditMode,
      }}
    />
  );
}
