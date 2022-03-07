import TextField from '@mui/material/TextField';
import { useEffect, useRef, useState } from 'react';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface ITextInfoField {
  initialValue: string;
  label: string;
  id: string;
  // All other props
  [x: string]: any;
}

export default function TextInfoField({ initialValue, label, id, ...rest }: ITextInfoField) {
  const { isEditMode, dispatch } = useResourceDetailsContext()!;

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const cellDirty = useRef(false);

  const handleOnChange = (e: any) => {
    cellDirty.current = true;
    setInternalCellValue(e.target.value);
  };

  const handleOnBlur = (e: any) => {
    if (cellDirty.current) {
      dispatch({
        type: 'editedInfoField',
        payload: {
          fieldType: 'text',
          fieldId: e.target.id,
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
      {...rest}
      id={id}
      label={label}
      size='small'
      type='text'
      fullWidth
      onChange={handleOnChange}
      onBlur={handleOnBlur}
      InputProps={{
        readOnly: !isEditMode,
      }}
      value={internalCellValue}
      variant='outlined'
    />
  );
}
