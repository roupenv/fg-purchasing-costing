import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ColumnWithLooseAccessor } from 'react-table';
import * as yup from 'yup';
import AlertDialog from '../Components/ResourceDetails/Dialogs/AlertDialog';
import DeleteDialog from '../Components/ResourceDetails/Dialogs/DeleteDialog';
import useResourceDetails from '../Components/ResourceDetails/Hooks/useResourceDetails';
import AutoCompleteInfoField from '../Components/ResourceDetails/InfoCardFields/AutoCompleteInfoField';
import DateInfoField from '../Components/ResourceDetails/InfoCardFields/DateInfoField';
import TextInfoField from '../Components/ResourceDetails/InfoCardFields/TextInfoField';
import RecordActionBtnGroup from '../Components/ResourceDetails/RecordActionBtnGroup';
import { ResourceDetailsContext } from '../Components/ResourceDetails/state/context';
import DetailsTable from '../Components/ResourceDetails/TableComponents/DetailsTable';
import ActionButtonsCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/ActionButtonsCell';
import AutoCompleteCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/AutoCompleteCell';
import CalculatedCurrencyCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CalculatedCurrencyCell';
import CheckboxCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CheckboxCell';
import CurrencyCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CurrencyCell';
import IntegerCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/IntegerCell';
import TextCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/TextCell';
import ColumnSumFooter from '../Components/ResourceDetails/TableComponents/TableFooterRenderers/ColumnSumFooter';
import { CustomReactTableColumn } from '../Components/ResourceDetails/TableComponents/types/CustomReactTableColumn';
import useFetchApi from '../Hooks/useFetchApi';
import { euroFormatter } from '../util/currencyFormatter';

interface invoiceDetailsApiHeader {
  id: number;
  invoice_number: string;
  date: string;
  vendor: string;
}
interface invoiceDetailsApiData {
  id: number;
  po_ref: string;
  product: string;
  color: string;
  quantity: number;
  price: string;
  discount: string;
  line_total: string;
  sample: boolean;
}

interface InvoiceDetailsApi {
  header: invoiceDetailsApiHeader;
  data: invoiceDetailsApiData[];
}

const tableColumns: CustomReactTableColumn<invoiceDetailsApiData>[] = [
  {
    Header: 'PO Ref.',
    accessor: 'po_ref',
    Cell: TextCell,
    defaultValue: '',
  },
  {
    Header: 'Product',
    accessor: 'product',
    Cell: AutoCompleteCell,
    defaultValue: '',
  },
  {
    Header: 'Color',
    accessor: 'color',
    Cell: TextCell,
    defaultValue: '',
  },
  {
    Header: 'Units',
    accessor: 'quantity',
    Cell: IntegerCell,
    Footer: (tableObj) => ColumnSumFooter(tableObj),
    defaultValue: 0,
  },
  {
    Header: 'Price',
    accessor: 'price',
    Cell: (tableObj) => CurrencyCell(tableObj, '€'),
    defaultValue: 0,
  },
  {
    Header: 'Discount',
    accessor: 'discount',
    Cell: (tableObj) => CurrencyCell(tableObj, '€'),
    Footer: (tableObj) => ColumnSumFooter(tableObj, euroFormatter),
    defaultValue: 0,
  },
  {
    Header: 'Line Total',
    id: 'line_total',
    accessor: (row) => (Number(row.quantity) * (Number(row.price) - Number(row.discount))).toFixed(2),
    Cell: (tableObj) => CalculatedCurrencyCell(tableObj, '€'),
    Footer: (tableObj) => ColumnSumFooter(tableObj, euroFormatter),
    defaultValue: 0,
  } as ColumnWithLooseAccessor<invoiceDetailsApiData>,
  {
    Header: 'Sample',
    accessor: 'sample',
    Cell: CheckboxCell,
    defaultValue: false,
  },
  {
    Header: 'Action',
    id: 'action-btn-group',
    Cell: ActionButtonsCell,
  },
];

let invoiceDetailsSchema = yup.object().shape({
  header: yup.object().shape({
    id: yup.number().integer(),
    invoice_number: yup.string().required('Must Specify Invoice Number').uppercase(),
    date: yup.date(),
    vendor: yup.string().required('Must Specify Vendor for this Invoice'),
  }),
  data: yup.array().of(
    yup.object().shape({
      id: yup.number().integer(),
      po_ref: yup.string().nullable(),
      product: yup.string().required('Line Item Must Contain Product').uppercase(),
      color: yup.string().uppercase().nullable(),
      quantity: yup.number().integer(),
      price: yup.number(),
      discount: yup.number(),
      line_total: yup.number(),
      sample: yup.boolean(),
    })
  ),
});

const initialValue = [{ value: '', label: '' }];

export default function InvoiceDetails() {
  const { data: productsList, loading: productsLoading } = useFetchApi(
    '/api/products/context-link',
    true,
    undefined,
    initialValue
  );
  const { data: vendorsList, loading: vendorsLoading } = useFetchApi(
    '/api/vendors/context-link',
    true,
    undefined,
    initialValue
  );

  const context = useResourceDetails<InvoiceDetailsApi, invoiceDetailsApiData>(tableColumns, productsList);
  const { resourceData, isLoading } = context;

  const contextLoading = productsLoading && vendorsLoading;
  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && !contextLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Invoice Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={invoiceDetailsSchema} />
            </Grid>
            <Grid item container xs={12}>
              <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                <Grid item sm={12}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Invoice Info</Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      divider={<Divider orientation='vertical' flexItem />}
                    >
                      <TextInfoField
                        id='invoice_number'
                        label='Invoice Number'
                        sx={{ width: '200px' }}
                        initialValue={resourceData.header.invoice_number}
                      />
                      <DateInfoField id='date' label='Date' initialValue={resourceData.header.date} width='200px' />
                      <AutoCompleteInfoField
                        id='vendor'
                        label='Vendor'
                        data={resourceData.header.vendor}
                        options={vendorsList?.map((vendor) => vendor.label)}
                        sx={{ width: '200px' }}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={12}>
              <DetailsTable
                tableTitle={'Invoice Details'}
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
