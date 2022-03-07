import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import { format } from 'date-fns';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface IYearInfoField {
  data: string;
  label: string;
  id: string;
  width: string
}

export default function YearInfoField({ data, label, id, width}: IYearInfoField) {
  const { isEditMode, dispatch } = useResourceDetailsContext()!;


  return (
    <DatePicker
      label={label}
      views={['year']}
      value={new Date(Number(data), 0)}
      onChange={(newDate) => {
        if (newDate) {
          const newDateYearOnly = format(new Date(newDate), 'yyyy');
          dispatch({
            type: 'editedInfoField',
            payload: {
              fieldType: 'year',
              fieldId: id,
              value: newDateYearOnly,
            },
          });
        } else{
          dispatch({
            type: 'editedInfoField',
            payload: {
              fieldType: 'year',
              fieldId: id,
              value: null,
            },
          });
        }
      }}
      readOnly={!isEditMode}
      renderInput={(params) => <TextField {...params} sx={{width: width}} size='small' id={id} />}
    />
  );
}
