import TextField from '@mui/material/TextField';
import NumberFormat from 'react-number-format';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface INumberInfoField {
  data: number;
  label: string;
  id: string;
  // All other props
  [x: string]: any;
}

export default function NumberInfoField({ data, label, id, ...rest }: INumberInfoField) {
  const { isEditMode, dispatch } = useResourceDetailsContext()!;

  return (
    <NumberFormat
      {...rest}
      thousandSeparator={true}
      decimalScale={4}
      customInput={TextField}
      onValueChange={(numberFormatValue) =>
        dispatch({
          type: 'editedInfoField',
          payload: {
            fieldType: 'number',
            fieldId: id,
            value: numberFormatValue.value,
          },
        })
      }
      id={id}
      label={label}
      InputLabelProps={{ shrink: true }} // To address Mui Limitation
      InputProps={{
        readOnly: !isEditMode,
      }}
      value={data}
      variant='outlined'
      size={'small' as unknown as any} // To address weird React Number Format typescript Limitation
    />
  );
}
