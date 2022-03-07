import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';
import useInputFocus from './Hooks/InputFocusHook';

export default function SelectTextCell(tableObj: any) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column, tableContext } = tableObj;

  const inputFocusElement = useInputFocus(tableObj);

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const handleOnChange = (e: any) => {
    setInternalCellValue(e.target.value);
  };

  const handleOnBlur = (e: any) => {
    dispatch({
      type: 'updatedTableCell',
      payload: {
        rowIndex: row.id,
        columnId: column.id,
        value: e.target.value,
      },
    });
  };

  useEffect(() => {
    setInternalCellValue(initialValue);
  }, [initialValue]);
  return (
    <TextField
      inputRef={inputFocusElement}
      size='small'
      select
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      InputProps={{
        readOnly: !isEditMode,
        disableUnderline: !isEditMode,
      }}
      value={internalCellValue}
      variant='standard'
    >
      {tableContext.map((option: any) => (
        <MenuItem key={option.value} value={option.value} id='products'>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
