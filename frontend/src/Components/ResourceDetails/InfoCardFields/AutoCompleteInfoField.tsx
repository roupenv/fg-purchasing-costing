import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useResourceDetailsContext from '../Hooks/useResourceDetailsContext';

interface IAutoCompleteInfoField {
  data: string;
  label: string;
  id: string;
  options: string[] | undefined;
  // All other props
  [x: string]: any;
}

export default function AutoCompleteInfoField({ data, label, id, options, ...rest }: IAutoCompleteInfoField) {
  const { dispatch, isEditMode } = useResourceDetailsContext()!;
  console.log();
  return (
    <Autocomplete
      {...rest}
      sx={{ width: '200px' }}
      disableClearable
      autoHighlight
      autoSelect
      loading={options ? false : true}
      forcePopupIcon={isEditMode}
      size='small'
      options={options ?? ['']}
      value={data}
      onChange={(event, newValue) => {
        dispatch({
          type: 'editedInfoField',
          payload: {
            fieldType: 'select',
            fieldId: id,
            value: newValue,
          },
        });
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{ ...params.InputProps, readOnly: !isEditMode }}
          variant={'outlined'}
          label={label}
          //Disable Textbox from displaying dropdown
          inputProps={{ ...params.inputProps, onMouseDown: !isEditMode ? () => null : params.inputProps.onMouseDown }}
          sx={{ '.MuiInput-root': { fontSize: 'body2.fontSize' } }}
        />
      )}
    />
  );
}
