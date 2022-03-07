import Autocomplete, { AutocompleteChangeReason } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';
import useInputFocus from './Hooks/InputFocusHook';

export default function AutoCompleteCell(tableObj: any) {
  const { dispatch, isEditMode, tableContext } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;

  const inputFocusElement = useInputFocus(tableObj);

  const [internalValue, setInternalValue] = useState(initialValue);

  const handleOnValueChange = (
    e: React.SyntheticEvent<Element, Event>,
    listValue: any,
    reason: AutocompleteChangeReason
  ) => {
    setInternalValue(listValue.value);
    dispatch({
      type: 'updatedTableCell',
      payload: {
        rowIndex: row.id,
        columnId: column.id,
        value: listValue.value,
      },
    });
  };

  useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);

  if (isEditMode) {
    return (
      <Autocomplete
        disablePortal
        disableClearable
        autoHighlight
        autoSelect
        size={'small'}
        options={tableContext!}
        value={internalValue}
        onChange={handleOnValueChange}
        isOptionEqualToValue={(option, value) => option.value === value || value === ''}
        renderInput={(params: any) => (
          <TextField
            {...params}
            inputRef={inputFocusElement}
            error={internalValue ? false : isEditMode ? true : false}
            variant={internalValue ? 'standard' : isEditMode ? 'outlined' : 'standard'}
            sx={{ '.MuiInput-root': { fontSize: 'body2.fontSize' } }}
          />
        )}
      />
    );
  } else {
    return <Typography variant='body2'>{initialValue}</Typography>;
  }
}
