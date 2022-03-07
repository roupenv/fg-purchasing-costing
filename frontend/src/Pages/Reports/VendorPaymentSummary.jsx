import React, { useState, useRef } from 'react';
import { useFetchTableData } from '../../Hooks/useFetchTableData';
import ReportsTable from '../../Components/ReportsTables/ReportsTable';
import ReactToPrint from 'react-to-print';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';

import { subDays, format } from 'date-fns';
import { usFormatter, euroFormatter } from '../../util/currencyFormatter';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';

const ungroupedColumns = ['dateSummary', 'monthIndex'];
const groupedColumns = ['month', 'year', 'day', 'monthIndex'];

const columns = [
  {
    Header: 'Group By',
    Footer: '',
    columns: [
      {
        Header: 'Payment Date',
        accessor: 'dateSummary',
      },
      {
        accessor: 'monthIndex',
      },
      {
        accessor: 'month',
        Header: 'Month',
        groupByControl: true,
        groupByValue: ['year', 'month', 'vendor'],
      },
      {
        accessor: 'day',
        Header: 'Day of Month',
      },
      {
        accessor: 'year',
        Header: 'Year',
        groupByControl: true,
        groupByValue: ['year', 'vendor'],
        Aggregated: ({ value }) => <b>{value}</b>,
      },
      {
        Header: 'Vendor',
        accessor: 'vendor',
      },
    ],
  },
  {
    Header: 'Info',
    Footer: <b>Grand Totals</b>,
    columns: [
      {
        Header: 'Exch Rate',
        accessor: 'payment_exch_rate',
        Cell: ({ value }) => Number(value).toFixed(3),
        Aggregated: ({ value }) => null,
      },
      {
        Header: 'Euro Payment',
        accessor: 'euro_payment',
        Cell: ({ value }) => euroFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }) => <b>{euroFormatter.format(value)}</b>,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum, row) => row.values.euro_payment + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{euroFormatter.format(total)}</b>;
        },
      },
      {
        Header: 'USD Cost',
        accessor: 'usd_cost',
        Cell: ({ value }) => usFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }) => <b>{usFormatter.format(value)}</b>,
        Footer: (info) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum, row) => row.values.usd_cost + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{usFormatter.format(total)}</b>;
        },
      },
    ],
  },
];

const dateToday = new Date();
const dateLastYear = subDays(new Date(), 365);

export default function VendorPaymentSummary() {
  const componentRef = useRef(null);


  const [startDate, setStartDate] = useState(dateLastYear);
  const [endDate, setEndDate] = useState(dateToday);

  const [resourceData, resourceColumns, loading] = useFetchTableData(
    `/api/reports/vendor-payment-summary?start=${format(startDate, 'yyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`,
    columns,
    'date'
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={11}>
          <Typography variant='h4'>Vendor Payments Summary</Typography>
        </Grid>

        <Grid item xs={1} container alignItems='flex-end' justifyContent='flex-end'>
          <ReactToPrint
            trigger={() => (
              <Button variant='contained' color='secondary'>
                <PrintIcon />
              </Button>
            )}
            content={() => componentRef.current}
          />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Paper elevation={6} sx={{ padding: '16px' }}>
              <Grid item container spacing={2}>
                <Grid item>
                  <Typography variant='h6'>Report Parameters</Typography>
                </Grid>
                <Grid item container spacing={4} justifyContent='center'>
                  <Grid item>
                    <DatePicker
                      label='Start Date'
                      value={startDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {!loading && (
            <ReportsTable
              ref={componentRef}
              grouping={true}
              footer={true}
              columns={resourceColumns}
              data={resourceData}
              ungroupedColumns={ungroupedColumns}
              groupedColumns={groupedColumns}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
