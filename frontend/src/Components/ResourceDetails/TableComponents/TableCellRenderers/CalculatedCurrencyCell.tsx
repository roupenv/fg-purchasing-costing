import Typography from '@mui/material/Typography';


export default function CalculatedCurrencyCell(tableObj: any, currencyPrefix: string = '$') {
  const initialValue = tableObj.value;

  return <Typography variant='body2'>{currencyPrefix + Number(initialValue).toFixed(2)}</Typography>;
}
