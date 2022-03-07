import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import GoToRecordBtn from '../Components/ResourceSummary/GoToRecordBtn';
import ResourceSummaryContainer from '../Components/ResourceSummary/ResourceSummaryContainer';
import { useFetchTableData } from '../Hooks/useFetchTableData';
import { euroFormatter, usFormatter } from '../util/currencyFormatter';
import { formattedDate } from '../util/dateTime';



const urlResource = '/payments';

const tableColumns = [
  {
    Header: 'Reference Number',
    accessor: 'reference_number',
    Cell: ({ value }: any) => <Typography variant='body2' sx={{ fontWeight: 'medium' }}>{value}</Typography>,

  },
  {
    Header: 'Date Booked',
    accessor: 'date_booked',
    Cell: ({ value }: any) =>formattedDate(new Date(value)),
  },
  {
    Header: 'Exch Rate',
    accessor: 'payment_exch_rate',
    Cell: ({ value }: any) => <Chip label={Number(value).toFixed(3)} sx={{ fontWeight: 'medium', '&.MuiChip-root': {bgcolor: 'secondary.light'}}}/>,
  },
  {
    Header: 'USD Cost',
    accessor: 'total_usd_cost',
    Cell: ({ value }: any) => usFormatter.format(value),
  },
  {
    Header: 'Euro Payment',
    accessor: 'total_euro_payment',
    Cell: ({ value }: any) => euroFormatter.format(value),
  },
  {
    Header: 'Actions',
    id: 'action-button-group',
    accessor: (originalRow: any, rowIndex: any) => (
      <GoToRecordBtn originalRow={originalRow} rowIndex={rowIndex} urlResource={urlResource} />
    ),
  },
];

export default function Payments() {
  const [data, columns, loading] = useFetchTableData('/api/payments', tableColumns);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Typography variant='h4'>Payments</Typography>
        </Grid>
        <Grid item xs></Grid>
        <Grid item xs='auto'>
          <Button
            variant='contained'
            color='secondary'
            component={Link}
            to={`/admin${urlResource}/new`}
            startIcon={<AddIcon />}
          >
            New Payment
          </Button>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!loading && (
        <ResourceSummaryContainer columns={columns} data={data} dateSortById=''/>
      )}
    </Box>
  );
}
