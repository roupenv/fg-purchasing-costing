import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from 'react';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';
import useInputFocus from './Hooks/InputFocusHook';

export default function TextCell(tableObj: any) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;

  const inputFocusElement = useInputFocus(tableObj);

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const cellDirty = useRef(false);

  const handleOnChange = (e: any) => {
    cellDirty.current = true;
    setInternalCellValue(e.target.value);
  };

  const handleOnBlur = (e: any) => {
    if (cellDirty.current) {
      dispatch({
        type: 'updatedTableCell',
        payload: {
          rowIndex: row.id,
          columnId: column.id,
          value: e.target.value,
        },
      });
    }
  };

  useEffect(() => {
    setInternalCellValue(initialValue);
  }, [initialValue]);

  return (
    <TextField
      inputRef={inputFocusElement}
      hiddenLabel
      variant='standard'
      size='small'
      type='text'
      color='primary'
      onBlur={handleOnBlur}
      value={internalCellValue ?? ''}
      onChange={handleOnChange}
      InputProps={{
        sx: { typography: 'body2' },
        disableUnderline: !isEditMode,
        readOnly: !isEditMode,
      }}
    />
  );
}
