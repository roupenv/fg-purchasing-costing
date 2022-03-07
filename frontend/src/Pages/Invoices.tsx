import AddIcon from '@mui/icons-material/Add';
import { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import GoToRecordBtn from '../Components/ResourceSummary/GoToRecordBtn';
import ResourceSummaryContainer from '../Components/ResourceSummary/ResourceSummaryContainer';
import { useFetchTableData } from '../Hooks/useFetchTableData';
import useLocationHistory from '../Hooks/useLocationHistory';
import { euroFormatter } from '../util/currencyFormatter';
import { formattedDate } from '../util/dateTime';



const urlResource = '/invoices';

interface IInvoices {
  id: number;
  invoice_number: string;
  date: Date;
  vendor: string;
  total_quantity: string;
  invoice_total: string;
}

const tableColumns = [
  {
    Header: 'Invoice',
    accessor: 'invoice_number',
    Cell: ({ value }: any) => (
      <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
        {value}
      </Typography>
    ),
  },
  {
    Header: 'Date',
    accessor: 'date',
    Cell: ({ value }: any) => formattedDate(new Date(value)),
  },
  {
    Header: 'Vendor',
    accessor: 'vendor',
  },
  {
    Header: 'Units',
    accessor: 'total_quantity',
    Cell: ({ value }: any) => (
      <Chip
        label={Number(value).toFixed(0)}
        sx={{ fontWeight: 'medium', '&.MuiChip-root': { bgcolor: 'secondary.light' } }}
      />
    ),
  },
  {
    Header: 'Total',
    accessor: 'invoice_total',
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

export default function Invoices() {
  const [data, columns, loading] = useFetchTableData<IInvoices[]>('/api/invoices', tableColumns);
  const { history } = useLocationHistory();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Typography variant='h4'>Invoices</Typography>
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
            New Invoice
          </Button>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
      {!loading && !isMobile ? (
        <ResourceSummaryContainer columns={columns} data={data} dateSortById='date' />
      ) : (
        <Paper elevation={6}>
          <Stack>
            <Grid container>
              {loading
                ? null
                : data.map((item) => {
                    return (
                      <Box onClick={() => history.push(`/admin${urlResource}/${item.id}`)}>
                        <Grid container item xs={12} rowSpacing={1} key={item.id} sx={{ p: '16px' }}>
                          <Grid item xs={6}>
                            <Typography variant='h6'>{item.invoice_number}</Typography>
                          </Grid>
                          <Grid item xs={6} container  justifyContent='flex-end'>
                            <Typography variant='subtitle1'>{formattedDate(new Date(item.date))}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
                              {item.vendor}
                            </Typography>{' '}
                          </Grid>
                          <Grid item xs={6} container direction='column' alignItems='flex-end'>
                            <Typography variant='h6'>{euroFormatter.format(Number(item.invoice_total))}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Chip
                              label={Number(item.total_quantity).toFixed(0) + ' Units'}
                              sx={{ fontWeight: 'medium', '&.MuiChip-root': { bgcolor: 'secondary.light' } }}
                            />{' '}
                          </Grid>
                        </Grid>
                        <Divider orientation='horizontal' />
                      </Box>
                    );
                  })}
            </Grid>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
