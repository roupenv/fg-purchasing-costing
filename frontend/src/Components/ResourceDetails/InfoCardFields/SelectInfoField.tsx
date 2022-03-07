import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface ISelectInfoField {
  id: string;
  label: string;
  value: string;
  options: { value: string | number; label: string }[];
  // All other props
  [x: string]: any;
}

export default function SelectInfoField({ id, label, value, options, ...rest }: ISelectInfoField) {
  const { isEditMode, dispatch } = useResourceDetailsContext()!;

  return (
    <TextField
      {...rest}
      label={label}
      size='small'
      select
      onChange={(e) => {
        dispatch({
          type: 'editedInfoField',
          payload: {
            fieldType: 'select',
            fieldId: id,
            value: e.target.value,
          },
        });
      }}
      inputProps={{
        readOnly: !isEditMode,
      }}
      value={value ?? ''}
      variant='outlined'
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} id={id} dense>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
