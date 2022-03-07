import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface IDateInfoField {
  initialValue: string;
  label: string;
  id: string;
  width: string;
  // All other props
  [x: string]: any;
}

export default function DateInfoField({ initialValue, label, id, width,...rest }: IDateInfoField) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;

  return (
    <DatePicker
      {...rest}
      label={label}
      value={initialValue}
      onChange={(newDate) => {
        if (newDate === null) {
          return;
        }
        if (newDate.toString() !== 'Invalid Date' || newDate === null) {
          dispatch({
            type: 'editedInfoField',
            payload: {
              fieldType: 'date',
              fieldId: id,
              value: newDate,
            },
          });
        }
      }}
      readOnly={isEditMode ? false : true}
      renderInput={(params) => <TextField {...params} sx={{width: width}} size='small' id={id} />}
    />
  );
}
