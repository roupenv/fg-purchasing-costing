import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import GoToRecordBtn from '../Components/ResourceSummary/GoToRecordBtn';
import ResourceSummaryContainer from '../Components/ResourceSummary/ResourceSummaryContainer';
import { useFetchTableData } from '../Hooks/useFetchTableData';
import { euroFormatter } from '../util/currencyFormatter';
import { formattedDate } from '../util/dateTime';




const urlResource = '/shipments';

const tableColumns = [
  {
    Header: 'Shipment Ref.',
    accessor: 'shipment_ref',
    Cell: ({ value }: any) => (
      <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    ),
  },
  {
    Header: 'Related Invoice',
    accessor: 'invoice_number',
  },
  {
    Header: 'Arrival Date',
    accessor: 'arrival_date',
    Cell: ({ value }: any) => formattedDate(new Date(value)),
  },
  {
    Header: 'Method',
    accessor: 'trans_method',
  },
  {
    Header: 'Packs',
    accessor: 'packs',
    Cell: ({ value }: any) => Number(value).toFixed(0),
  },
  {
    Header: 'Units',
    accessor: 'units_shipped',
    Cell: ({ value }: any) => (
      <Chip
        label={Number(value).toFixed(0)}
        sx={{ fontWeight: 'medium', '&.MuiChip-root': { bgcolor: 'secondary.light' } }}
      />
    ),
  },
  {
    Header: 'Shipping Costs',
    accessor: 'shipping_costs',
    Cell: ({ value }: any) => euroFormatter.format(value),
  },
  {
    Header: 'Duty Costs',
    accessor: 'duty_costs',
    Cell: ({ value }: any) => euroFormatter.format(value),
  },
  {
    Header: 'Insurance Costs',
    accessor: 'insurance_costs',
    Cell: ({ value }: any) => euroFormatter.format(value),
  },
  {
    Header: 'Vendor',
    accessor: 'vendor',
  },
  {
    Header: 'Actions',
    id: 'action-button-group',
    accessor: (originalRow: any, rowIndex: any) => (
      <GoToRecordBtn originalRow={originalRow} rowIndex={rowIndex} urlResource={urlResource} />
    ),
  },
];

export default function Shipments() {
  const [data, columns, loading] = useFetchTableData('/api/shipments', tableColumns);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Typography variant='h4'>Shipments</Typography>
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
            New Shipment
          </Button>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!loading && (
        <ResourceSummaryContainer columns={columns} data={data} dateSortById='arrival_date'/>
      )}
    </Box>
  );
}
