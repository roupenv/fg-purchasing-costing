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

const urlResource = '/products';

const tableColumns = [
  {
    Header: 'Name',
    accessor: 'product_name',
    Cell: ({ value }: any) => (
      <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    ),
  },
  {
    Header: 'Bottom',
    accessor: 'bottom',
  },
  {
    Header: 'Collection',
    accessor: 'collection',
    Cell: ({ value }: any) => (
      <Chip label={value} sx={{ fontWeight: 'medium', '&.MuiChip-root': { bgcolor: 'secondary.light' } }} />
    ),
  },
  {
    Header: 'Season',
    accessor: 'season',
  },
  {
    Header: 'Tarrif Code',
    accessor: 'tarrif_code',
  },
  {
    Header: 'Actions',
    id: 'action-button-group',
    accessor: (originalRow: any, rowIndex: any) => (
      <GoToRecordBtn originalRow={originalRow} rowIndex={rowIndex} urlResource={urlResource} />
    ),
  },
];

export default function Invoices() {
  const [data, columns, loading] = useFetchTableData('/api/products', tableColumns);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Typography variant='h4'>Products</Typography>
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
            New Product
          </Button>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!loading && <ResourceSummaryContainer columns={columns} data={data} dateSortById='date' />}
    </Box>
  );
}
