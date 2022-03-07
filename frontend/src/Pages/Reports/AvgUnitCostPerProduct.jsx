import React, { useState, useRef, useEffect } from 'react';
import { useFetchTableData } from '../../Hooks/useFetchTableData';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';
import ReportsTable from '../../Components/ReportsTables/ReportsTable';
import { subDays, format } from 'date-fns';
import { usFormatter, euroFormatter } from '../../util/currencyFormatter';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import DatePicker from '@mui/lab/DatePicker';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ReactToPrint from 'react-to-print';
import NumberFormat from 'react-number-format';

const columns = [
  {
    Header: 'Group By',
    Footer: '',
    columns: [
      {
        Header: 'Year',
        accessor: 'year',
        groupByControl: true,
        groupByValue: ['year'],
      },
      {
        Header: 'Product',
        accessor: 'product_name',
        groupByControl: true,
        groupByValue: ['product_name'],
      },
    ],
  },
  {
    Header: 'Info',
    Footer: '',
    columns: [
      
      {
        Header: 'Euro Cost',
        accessor: 'price',
        Aggregated: () => null,
        Cell: ({ value }) => euroFormatter.format(value),
      },
      {
        Header: 'Avg Exch Rate',
        accessor: 'avg_exch_rate',
        Aggregated: () => null,
      },
      {
        Header: 'Avg USD Cost',
        accessor: 'us_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Avg Ship',
        accessor: 'avg_shipping_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Avg Insur',
        accessor: 'avg_insurance_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Avg Duty',
        accessor: 'avg_duty_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Avg R&D',
        accessor: 'development_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Commission',
        accessor: 'commission',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Misc',
        accessor: 'misc_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Landed',
        accessor: 'landed_cost',
        Aggregated: () => null,
        Cell: ({ value }) => usFormatter.format(value),
      },
      {
        Header: 'Total Units',
        accessor: 'total_pairs',
        Cell: (info) => {
          const maxOfAllRows = Math.max(...info.data.map((row) => row.total_pairs));
          const percOfMax = Math.round((info.value / maxOfAllRows) * 100);
          return (
            <div
              style={{
                background: `linear-gradient(to right, rgba(0,211,255,1) 10%, rgba(255,255,255,0) ${percOfMax}%)`,
              }}
            >
              {info.value}
            </div>
          );
        },
      },
    ],
  },
];

const dateToday = new Date();
const dateLastYear = subDays(new Date(), 365);

export default function AvgUnitCostPerProduct() {
  const componentRef = useRef(null);


  const [startDate, setStartDate] = useState(new Date('01 Jan 1970 00:00:00 UTC'));
  const [endDate, setEndDate] = useState(dateToday);

  const [commission, setCommission] = useState(0.05);
  const [miscellaneous, setMiscellaneous] = useState(0.03);
  const [exchangePadding, setExchangePadding] = useState(0.03);
  const [development, setDevelopment] = useState(2.25);

  const [reportType, setReportType] = useState('allTime');

  useEffect(() => {
    if (reportType === 'byYear') {
      setStartDate(dateLastYear);
      setEndDate(dateToday);
    } else {
      setStartDate(new Date('01 Jan 1970 00:00:00 UTC'));
      setEndDate(dateToday);
    }
  }, [reportType]);

  const [resourceData, resourceColumns, loading] = useFetchTableData(
    `/api/reports/avg-style-cost?reportType=${reportType}&start=${format(startDate, 'yyy-MM-dd')}&end=${format(
      endDate,
      'yyy-MM-dd'
    )}&commission=${commission}&miscellaneous=${miscellaneous}&exchangePadding=${exchangePadding}&development=${development}`,
    columns
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={11}>
          <Typography variant='h4'>Average Unit Cost Per Product</Typography>
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
                <Grid item container spacing={4} justifyContent='flex-start' alignItems='center'>
                  <Grid item xs={2}>
                    <TextField
                      label='Report Type'
                      select
                      sx={{ width: '125px' }}
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                    >
                      <MenuItem value={'allTime'}>All Time</MenuItem>
                      <MenuItem value={'byYear'}>By Year</MenuItem>
                    </TextField>
                  </Grid>
                  {reportType === 'allTime' ? (
                    <Grid item xs />
                  ) : (
                    <>
                      <Grid item xs={2}>
                        <DatePicker
                          label='Start Date'
                          value={startDate}
                          onChange={(newValue) => {
                            setStartDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <DatePicker
                          label='End Date'
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <Stack direction='row' spacing={4} divider={<Divider orientation='vertical' flexItem />}>
                    <NumberFormat
                      customInput={TextField}
                      suffix={'%'}
                      decimalScale={2}
                      value={Number(commission) * 100}
                      onValueChange={(e) => setCommission(Number(e.floatValue) / 100)}
                      label='Commission'
                      size='small'
                    />
                    <NumberFormat
                      customInput={TextField}
                      suffix={'%'}
                      decimalScale={2}
                      value={Number(miscellaneous) * 100}
                      onValueChange={(e) => setMiscellaneous(Number(e.floatValue) / 100)}
                      label='Miscellaneous'
                      size='small'
                    />
                    <NumberFormat
                      customInput={TextField}
                      suffix={'%'}
                      decimalScale={2}
                      value={Number(exchangePadding) * 100}
                      onValueChange={(e) => setExchangePadding(Number(e.floatValue) / 100)}
                      label='Exchange Padding'
                      size='small'
                    />
                    <NumberFormat
                      thousandSeparator={true}
                      prefix={'$'}
                      decimalScale={2}
                      customInput={TextField}
                      value={Number(development)}
                      onValueChange={(e) => setDevelopment(Number(e.floatValue).toFixed(2))}
                      label='Development'
                      size='small'
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={12}>
          {!loading && (
            <ReportsTable
              ref={componentRef}
              grouping={reportType === 'byYear' ? true : false}
              ungroupedColumns={[]}
              groupedColumns={['year']}
              footer={true}
              columns={resourceColumns}
              data={resourceData}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
