import AddIcon from '@mui/icons-material/Add';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import GoToRecordBtn from '../Components/ResourceSummary/GoToRecordBtn';
import ResourceSummaryContainer from '../Components/ResourceSummary/ResourceSummaryContainer';
import { useFetchTableData } from '../Hooks/useFetchTableData';


const urlResource = '/tarrifs';

const tableColumns = [
  {
    Header: 'Tarrif Code',
    accessor: 'tarrif_code',
    Cell: ({ value }: any) => (
      <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    ),
  },
  {
    Header: 'Material',
    accessor: 'material',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },
  {
    Header: 'Actions',
    id: 'action-button-group',
    accessor: (originalRow: any, rowIndex: any) => (
      <GoToRecordBtn originalRow={originalRow} rowIndex={rowIndex} urlResource={urlResource} />
    ),  },
];

export default function Tarrifs() {
  const [data, columns, loading] = useFetchTableData('/api/tarrifs', tableColumns);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Typography variant='h4'>Tarrifs</Typography>
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
            New Tarrif
          </Button>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!loading && (
        <ResourceSummaryContainer columns={columns} data={data} dateSortById='date_booked'/>
      )}
    </Box>
  );
}
