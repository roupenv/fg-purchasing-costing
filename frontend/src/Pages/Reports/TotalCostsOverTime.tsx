import React, { useState, useRef } from 'react';
import { useFetchTableData } from '../../Hooks/useFetchTableData';
import ReactToPrint from 'react-to-print';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';
import ReportsTable from '../../Components/ReportsTables/ReportsTable';

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
        Header: 'Invoice Date',
        accessor: 'dateSummary',
      },
      {
        accessor: 'monthIndex',
      },
      {
        accessor: 'month',
        Header: 'Month',
        groupByControl: true,
        groupByValue: ['year', 'month'],
      },
      {
        accessor: 'day',
        Header: 'Day of Month',
      },
      {
        accessor: 'year',
        Header: 'Year',
        groupByControl: true,
        groupByValue: ['year'],
        Aggregated: ({ value }: any) => <b>{value}</b>,
      },
    ],
  },
  {
    Header: 'Info',
    Footer: <b>Grand Totals</b>,
    columns: [
      {
        Header: 'Ttl Units',
        accessor: 'total_units',
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{value}</b>,
        Footer: (info: any) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_units + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{total}</b>;
        },
      },
      {
        Header: 'Ttl Amount',
        accessor: 'total_amount',
        Cell: ({ value }: any) => euroFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{euroFormatter.format(value)}</b>,
        Footer: (info: any) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_amount + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{euroFormatter.format(total)}</b>;
        },
      },
      {
        Header: 'Ttl Disc',
        accessor: 'total_disc',
        Cell: ({ value }: any) => euroFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{euroFormatter.format(value)}</b>,
        Footer: (info: any) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_disc + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{euroFormatter.format(total)}</b>;
        },
      },
      {
        Header: 'Ttl Shipping',
        accessor: 'total_shipping',
        Cell: ({ value }: any) => usFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{usFormatter.format(value)}</b>,
        Footer: (info: any) => {
          // Only calculate total visits if rows change
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_shipping + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{usFormatter.format(total)}</b>;
        },
      },
      {
        Header: 'Ttl Duty',
        accessor: 'total_duty',
        Cell: ({ value }: any) => usFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{usFormatter.format(value)}</b>,
        Footer: (info: any) => {
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_duty + sum, 0),
            [info.preGroupedRows]
          );
          return <b>{usFormatter.format(total)}</b>;
        },
      },
      {
        Header: 'Ttl Insurance',
        accessor: 'total_insurance',
        Cell: ({ value }: any) => usFormatter.format(value),
        aggregate: 'sum',
        Aggregated: ({ value }: any) => <b>{usFormatter.format(value)}</b>,
        Footer: (info: any) => {
          const total = React.useMemo(
            () => info.preGroupedRows.reduce((sum: number, row: any) => row.values.total_insurance + sum, 0),
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

export default function TotalCostsOverTime() {
  const componentRef = useRef(null);

  const [startDate, setStartDate] = useState<Date>(dateLastYear);
  const [endDate, setEndDate] = useState<Date>(dateToday);

  const [resourceData, resourceColumns, loading] = useFetchTableData(
    `/api/reports/yearly-summary?start=${format(startDate, 'yyy-MM-dd')}&end=${format(endDate, 'yyyy-MM-dd')}`,
    columns,
    'invoice_date'
  );

  return (
    <Box className='reports'>
      <Grid container spacing={4}>
        <Grid item xs={11}>
          <Typography variant='h4'>Total Costs Over Time</Typography>
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
                        setStartDate(newValue!);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item>
                    <DatePicker
                      label='End Date'
                      value={endDate}
                      onChange={(newValue) => {
                        setEndDate(newValue!);
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
