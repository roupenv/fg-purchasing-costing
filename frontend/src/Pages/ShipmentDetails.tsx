import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import NumberFormat from 'react-number-format';
import { ColumnWithLooseAccessor } from 'react-table';
import * as yup from 'yup';
import AlertDialog from '../Components/ResourceDetails/Dialogs/AlertDialog';
import DeleteDialog from '../Components/ResourceDetails/Dialogs/DeleteDialog';
import useResourceDetails from '../Components/ResourceDetails/Hooks/useResourceDetails';
import AutoCompleteInfoField from '../Components/ResourceDetails/InfoCardFields/AutoCompleteInfoField';
import CurrencyInfoField from '../Components/ResourceDetails/InfoCardFields/CurrencyInfoField';
import DateInfoField from '../Components/ResourceDetails/InfoCardFields/DateInfoField';
import NumberInfoField from '../Components/ResourceDetails/InfoCardFields/NumberInfoField';
import SelectInfoField from '../Components/ResourceDetails/InfoCardFields/SelectInfoField';
import TextInfoField from '../Components/ResourceDetails/InfoCardFields/TextInfoField';
import RecordActionBtnGroup from '../Components/ResourceDetails/RecordActionBtnGroup';
import { ResourceDetailsContext } from '../Components/ResourceDetails/state/context';
import DetailsTable from '../Components/ResourceDetails/TableComponents/DetailsTable';
import ActionButtonsCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/ActionButtonsCell';
import AutoCompleteCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/AutoCompleteCell';
import CalculatedCurrencyCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CalculatedCurrencyCell';
import CurrencyCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/CurrencyCell';
import IntegerCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/IntegerCell';
import PercentageCell from '../Components/ResourceDetails/TableComponents/TableCellRenderers/PercentageCell';
import ColumnSumFooter from '../Components/ResourceDetails/TableComponents/TableFooterRenderers/ColumnSumFooter';
import { CustomReactTableColumn } from '../Components/ResourceDetails/TableComponents/types/CustomReactTableColumn';
import useFetchApi from '../Hooks/useFetchApi';
import { euroFormatter, usFormatter } from '../util/currencyFormatter';

interface shipmentDetailsApiHeader {
  id: number;
  shipment_ref: string;
  vendor: string;
  shipment_invoice: string;
  departure_date: string;
  arrival_date: string;
  trans_method: string;
  weight: number;
  weight_unit: string;
  volume: number;
  volume_unit: string;
  chargeable_weight: number;
  chargeable_weight_unit: string;
  packs: number;
  packs_type: string;
  units_shipped: number;
  shipping_costs: string;
  duty_costs: string;
  insurance_costs: string;
  euro_value: string;
  us_value: string;
}
interface shipmentDetailsApiData {
  id: number;
  tarrif: string;
  units_entered: number;
  value_entered: string;
  duty_percentage: number;
  processing_fee_percentage: number;
  line_total: string;
}

interface shipmentDetailsApi {
  header: shipmentDetailsApiHeader;
  data: shipmentDetailsApiData[];
}

const tableColumns: CustomReactTableColumn<shipmentDetailsApiData>[] = [
  {
    Header: 'Tarrif Code',
    accessor: 'tarrif',
    Cell: AutoCompleteCell,
    defaultValue: '',
  },
  {
    Header: 'Units Entered',
    accessor: 'units_entered',
    Cell: IntegerCell,
    Footer: (tableObj) => ColumnSumFooter(tableObj),
    defaultValue: '',
  },
  {
    Header: 'Value Entered',
    accessor: 'value_entered',
    Cell: (tableObj) => CurrencyCell(tableObj),
    Footer: (tableObj) => ColumnSumFooter(tableObj, usFormatter),
    defaultValue: '',
  },
  {
    Header: 'Duty Perc.',
    accessor: 'duty_percentage',
    Cell: (tableObj: any) => PercentageCell(tableObj, 2),
    defaultValue: 0,
  },
  {
    Header: 'Processing Fee Perc.',
    accessor: 'processing_fee_percentage',
    Cell: (tableObj: any) => PercentageCell(tableObj, 5),
    defaultValue: 0.003464,
  },
  {
    Header: 'Line Total',
    id: 'line_total',
    accessor: (row) =>
      (
        Number(row.value_entered) * Number(row.duty_percentage) +
        Number(row.value_entered) * Number(row.processing_fee_percentage)
      ).toFixed(2),
    Cell: (tableObj) => CalculatedCurrencyCell(tableObj, '€'),
    Footer: (tableObj) => ColumnSumFooter(tableObj, euroFormatter),
    defaultValue: 0,
  } as ColumnWithLooseAccessor<shipmentDetailsApiData>,
  {
    Header: 'Action',
    id: 'action-btn-group',
    Cell: ActionButtonsCell,
  },
];

let shipmentDetailsSchema = yup.object().shape({
  header: yup.object().shape({
    id: yup.number().integer(),
    shipment_ref: yup.string().required('Must Specify Shipping Reference Number for this Shipment').uppercase(),
    vendor: yup.string().required('Must Specify Shipping Vendor for this Shipment'),
    shipment_invoice: yup.string(),
    departure_date: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .required('Must Specify Departure Date'),
    arrival_date: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === '' ? null : curr))
      .required('Must Specify Arrival Date'),
    trans_method: yup.string().uppercase().oneOf(['AIR', 'SEA'], `Transportation Method must be either 'AIR' or 'SEA'`),
    weight: yup.number(),
    weight_unit: yup.string().uppercase(),
    volume: yup.number(),
    volume_unit: yup.string().uppercase(),
    chargeable_weight: yup.number(),
    chargeable_weight_unit: yup.string().uppercase(),
    packs: yup.number().integer('Packs Must be an Integer'),
    packs_type: yup.string().uppercase(),
    units_shipped: yup
      .number()
      .integer('Units Shipped Must be an Integer')
      .moreThan(0, 'Units Shipped Must be Greater Than 0'),
    shipping_costs: yup.number().moreThan(0, 'Shipping Costs Must be Greater Than 0'),
    duty_costs: yup.number().moreThan(0, 'Duty Costs Must be Greater Than 0'),
    insurance_costs: yup.number().moreThan(0, 'Insurance Costs Must be Greater Than 0'),
    euro_value: yup.number().moreThan(0, 'Euro Value  Must be Greater Than 0'),
    us_value: yup.number().moreThan(0, 'U.S Value Must be Greater Than 0'),
  }),
  data: yup.array().of(
    yup.object().shape({
      id: yup.number().integer(),
      tarrif: yup.string().required('Line Item Must Contain Tarrif Code'),
      units_entered: yup.number().integer().moreThan(0, 'Line Item Units Entered Must be greater than 0'),
      value_entered: yup.number().integer().moreThan(0, 'Line Item Value Entered Must be greater than 0'),
      duty_percentage: yup
        .number()
        .moreThan(0, 'Line Items Duty Percentage Must be between 0%-99%')
        .lessThan(1, 'Line Items Duty Percentage Must be between 0%-99%'),
      processing_fee_percentage: yup
        .number()
        .moreThan(0, 'Line Items Duty Percentage Must be between 0%-1%')
        .lessThan(0.1, 'Line Items Duty Percentage Must be between 0%-1%'),
      line_total: yup.number(),
    })
  ),
});

const initialValue = [{ value: '', label: '' }];

const transportationMethod = [
  { value: 'AIR', label: 'AIR' },
  { value: 'SEA', label: 'SEA' },
];

export default function ShipmentDetails() {
  const { data: tarrifsList, loading: tarrifsLoading } = useFetchApi(
    '/api/tarrifs/context-link',
    true,
    undefined,
    initialValue
  );
  const { data: invoicesList, loading: invoicesLoading } = useFetchApi(
    '/api/invoices/context-link',
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

  const context = useResourceDetails<shipmentDetailsApi, shipmentDetailsApiData>(tableColumns, tarrifsList);

  const { resourceData, isLoading } = context;

  const contextLoading = tarrifsLoading && invoicesLoading && vendorsLoading;
  return (
    <ResourceDetailsContext.Provider value={context}>
      <Box>
        <DeleteDialog />
        <AlertDialog />
        {!isLoading && !contextLoading && (
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant='h4'>Shipment Details</Typography>
            </Grid>
            <Grid item container xs={6} justifyContent='flex-end'>
              <RecordActionBtnGroup schemaValidation={shipmentDetailsSchema} />
            </Grid>
            <Grid item container xs={12} spacing={2}>
              <Grid item sm={4}>
                <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Info</Typography>
                    <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                      <TextInfoField
                        id='shipment_ref'
                        label='Shipment Ref'
                        initialValue={resourceData.header.shipment_ref}
                        sx={{ width: '200px' }}
                      />
                      <AutoCompleteInfoField
                        id='vendor'
                        label='Vendor'
                        data={resourceData.header.vendor}
                        options={vendorsList?.map((vendor) => vendor.label)}
                        sx={{ width: '200px' }}
                      />
                      <AutoCompleteInfoField
                        id='shipment_invoice'
                        label='Related Invoice'
                        data={resourceData.header.shipment_invoice}
                        options={invoicesList?.map((invoice) => invoice.label)}
                        sx={{ width: '200px' }}
                      />

                      <DateInfoField
                        id='departure_date'
                        label='Departure Date'
                        initialValue={resourceData.header.departure_date}
                        width='200px'
                      />

                      <DateInfoField
                        id='arrival_date'
                        label='Arrival Date'
                        initialValue={resourceData.header.arrival_date}
                        width='200px'
                      />

                      <SelectInfoField
                        id='trans_method'
                        label='Trans Method'
                        value={resourceData.header.trans_method}
                        options={transportationMethod}
                        sx={{ width: 150 }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Cargo Data</Typography>
                    <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                        <NumberInfoField
                          id='weight'
                          label='Weight'
                          data={resourceData.header.weight}
                          sx={{ width: '200px' }}
                        />
                        <TextInfoField
                          id='weight_unit'
                          label='Unit'
                          initialValue={resourceData.header.weight_unit}
                          sx={{ width: '200px' }}
                        />
                      </Stack>
                      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                        <NumberInfoField
                          id='volume'
                          label='Volume'
                          data={resourceData.header.volume}
                          sx={{ width: '200px' }}
                        />
                        <TextInfoField
                          id='volume_unit'
                          label='Unit'
                          initialValue={resourceData.header.volume_unit}
                          sx={{ width: '200px' }}
                        />
                      </Stack>
                      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                        <NumberInfoField
                          id='chargeable_weight'
                          label='Chargeable Weight'
                          data={resourceData.header.chargeable_weight}
                          sx={{ width: '200px' }}
                        />
                        <TextInfoField
                          id='chargeable_weight_unit'
                          label='Unit'
                          initialValue={resourceData.header.chargeable_weight_unit}
                          sx={{ width: '200px' }}
                        />
                      </Stack>
                      <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
                        <NumberInfoField
                          id='packs'
                          label='Packs'
                          data={resourceData.header.packs}
                          sx={{ width: '200px' }}
                        />
                        <TextInfoField
                          id='packs_type'
                          label='Type'
                          initialValue={resourceData.header.packs_type}
                          sx={{ width: '200px' }}
                        />
                      </Stack>

                      <NumberInfoField
                        id='units_shipped'
                        label='Units Shipped'
                        data={resourceData.header.units_shipped}
                        sx={{ width: '200px' }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
              <Grid item sm={4}>
                <Paper elevation={6} sx={{ padding: '16px', width: 1 }}>
                  <Stack direction='column' spacing={2}>
                    <Typography variant='h6'>Costs</Typography>
                    <Stack direction='column' spacing={2} divider={<Divider orientation='horizontal' flexItem />}>
                      <CurrencyInfoField
                        id='shipping_costs'
                        label='Shipping Costs'
                        data={resourceData.header.shipping_costs}
                        sx={{ width: '200px' }}
                      />
                      <CurrencyInfoField
                        id='insurance_costs'
                        label='Insurance Costs'
                        data={resourceData.header.insurance_costs}
                        sx={{ width: '200px' }}
                      />
                      <CurrencyInfoField
                        id='duty_costs'
                        label='Duty Costs'
                        data={resourceData.header.duty_costs}
                        sx={{ width: '200px' }}
                      />
                      <CurrencyInfoField
                        id='euro_value'
                        label='Euro Value'
                        currencyPrefix='€'
                        data={resourceData.header.euro_value}
                        sx={{ width: '200px' }}
                      />

                      <CurrencyInfoField
                        id='us_value'
                        label='US Value'
                        data={resourceData.header.us_value}
                        sx={{ width: '200px' }}
                      />
                      <NumberFormat
                        thousandSeparator={true}
                        decimalScale={4}
                        customInput={TextField}
                        label='Exchange Rate'
                        InputLabelProps={{ shrink: true }} // To address Mui Limitation
                        InputProps={{
                          readOnly: true,
                        }}
                        value={Number(resourceData.header.us_value) / Number(resourceData.header.euro_value)}
                        variant='outlined'
                        size={'small' as unknown as any} // To address weird React Number Format typescript Limitation
                        sx={{ width: '200px' }}
                      />
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12}>
              <DetailsTable
                tableTitle={'Tarrif Items'}
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
