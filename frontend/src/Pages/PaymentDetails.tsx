import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import AlertDialog from '../Components/ResourceDetails/Dialogs/AlertDialog';
import DeleteDialog from '../Components/ResourceDetails/Dialogs/DeleteDialog';
import useResourceDetails from '../Components/ResourceDetails/Hooks/useResourceDetails';
import DateInfoField from '../Components/ResourceDetails/InfoCardFields/DateInfoField';
import NumberInfoField from '../Components/ResourceDetails/InfoCardFields/NumberInfoField';
import TextInfoField from '../Components/ResourceDetails/InfoCardFields/TextInfoField';
import RecordActionBtnGroup from '../Components/ResourceDetails/RecordActionBtnGroup';
import { ResourceDetailsContext } from '../Components/ResourceDetails/state/context';
import DetailsTable from '../Components/ResourceDetails/TableComponents/DetailsTable';
import ActionButtonsCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/ActionButtonsCell';
import AutoCompleteCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/AutoCompleteCell';
import CurrencyCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CurrencyCell';
import TextCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/TextCell';
import ColumnSumFooter from '../Components/ResourceDetails/TableComponents/TableFooterRenderers/ColumnSumFooter';
import { CustomReactTableColumn } from '../Components/ResourceDetails/TableComponents/types/CustomReactTableColumn';
import useFetchApi from '../Hooks/useFetchApi';
import { euroFormatter } from '../util/currencyFormatter';

interface paymentDetailsApiHeader {
  id: number;
  reference_number: string;
  date_booked: string;
  payment_exch_rate: number;
}
interface paymentDetailsApiData {
  id: number;
  vendor: string;
  usd_cost: string;
  euro_payment: string;
  tracking_number: string;
  description: string;
}

interface PaymentDetailsApi {
  header: paymentDetailsApiHeader;
  data: paymentDetailsApiData[];
}

const tableColumns: CustomReactTableColumn<paymentDetailsApiData>[] = [
  {
    Header: 'Vendor',
    accessor: 'vendor',
    Cell: AutoCompleteCell,
    defaultValue: '',
  },
  {
    Header: 'USD Cost',
    accessor: 'usd_cost',
    Cell: (tableObj) => CurrencyCell(tableObj),
    Footer: (tableObj) => ColumnSumFooter(tableObj, euroFormatter),
    defaultValue: 0,
  },
  {
    Header: 'Euro Payment',
    accessor: 'euro_payment',
    Cell: (tableObj) => CurrencyCell(tableObj, '€'),
    Footer: (tableObj) => ColumnSumFooter(tableObj, euroFormatter),
    defaultValue: 0,
  },
  {
    Header: 'Tracking Number',
    accessor: 'tracking_number',
    Cell: TextCell,
    defaultValue: '',
  },
  {
    Header: 'Description',
    accessor: 'description',
    Cell: TextCell,
    defaultValue: '',
  },
  {
    Header: 'Action',
    id: 'action-btn-group',
    Cell: ActionButtonsCell,
  },
];

let paymentDetailsSchema = yup.object().shape({
  header: yup.object().shape({
    id: yup.number().integer(),
    reference_number: yup.string().required('Must Specify Reference Number').uppercase(),
    date_booked: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .required('Must Specify Date Payment Occurred'),
    payment_exch_rate: yup.number().required('Must Specify Exchange Rate for this Payment').moreThan(0),
  }),
  data: yup.array().of(
    yup.object().shape({
      id: yup.number().integer(),
      vendor: yup.string().required('Line Item Must Contain Vendor'),
      usd_cost: yup.number().moreThan(0, 'Please enter US Cost Value Greater Than 0'),
      euro_payment: yup.number().moreThan(0, 'Please enter Euro Payment Value Greater Than 0'),
      tracking_number: yup.string().nullable(),
      description: yup.string().nullable(),
    })
  ),
});

export default function PaymentDetails() {
  const { data: vendorsList, loading: vendorsLoading } = useFetchApi('/api/vendors/context-link', true, undefined, [
    { value: '', label: '' },
  ]);

  const context = useResourceDetails<PaymentDetailsApi, paymentDetailsApiData>(tableColumns, vendorsList);

  const { resourceData, isLoading } = context;

  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && !vendorsLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Payment Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={paymentDetailsSchema} />
            </Grid>
            <Grid item container xs={12}>
              <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                <Grid item sm={12}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Payment Info</Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      divider={<Divider orientation='vertical' flexItem />}
                    >
                      <TextInfoField
                        id='reference_number'
                        label='Reference Number'
                        initialValue={resourceData.header.reference_number}
                        sx={{ width: '200px' }}
                      />
                      <DateInfoField
                        id='date_booked'
                        label='Date Booked'
                        initialValue={resourceData.header.date_booked}
                        width='200px'
                      />
                      <NumberInfoField
                        id='payment_exch_rate'
                        label='Payment Exch Rate'
                        data={resourceData.header.payment_exch_rate}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12}>
              <DetailsTable
                tableTitle={'Payment Details'}
                columns={tableColumns}
                data={resourceData.data}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </ResourceDetailsContext.Provider>
  );
}