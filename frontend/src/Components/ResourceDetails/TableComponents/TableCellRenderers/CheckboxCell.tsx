import { useState, useEffect, useRef } from 'react';
import Checkbox from '@mui/material/Checkbox';
import useResourceDetailsContext from '../../Hooks/useResourceDetailsContext';

export default function CheckboxCell(tableObj: any) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  const { value: initialValue, row, column } = tableObj;

  const [internalCellValue, setInternalCellValue] = useState(initialValue);
  const cellDirty = useRef(false);

  const handleOnChange = (e: any) => {
    cellDirty.current = true;
    setInternalCellValue(e.target.checked);
  };

  const handleOnBlur = (e: any) => {
    if (cellDirty.current) {
      dispatch({
        type: 'updatedTableCell',
        payload: {
          rowIndex: row.id,
          columnId: column.id,
          value: e.target.checked,
        },
      });
    }
  };

  useEffect(() => {
    setInternalCellValue(initialValue);
  }, [initialValue]);

  return (
    <Checkbox
      size='small'
      disabled={!isEditMode}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      checked={internalCellValue}
    />
  );
}
