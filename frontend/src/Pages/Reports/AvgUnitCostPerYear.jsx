import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import PrintIcon from '@mui/icons-material/Print';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useState, useRef } from 'react';
import NumberFormat from 'react-number-format';
import ReportsTable from '../../Components/ReportsTables/ReportsTable';
import { useFetchTableData } from '../../Hooks/useFetchTableData';
import { euroFormatter, usFormatter } from '../../util/currencyFormatter';
import ReactToPrint from 'react-to-print';

const columns = [
  {
    Header: 'Year',
    accessor: 'year_summary',
  },
  {
    Header: 'Total Units',
    accessor: 'sum_total_units',
  },
  {
    Header: 'Avg Factory Cost Per Unit',
    accessor: 'avg_euro_per_unit',
    Cell: ({ value }) => euroFormatter.format(value),
  },
  {
    Header: 'Avg Landed Cost Per Pair',
    accessor: 'avg_landed_per_unit',
    Cell: ({ value }) => usFormatter.format(value),
  },
  {
    Header: '% Diff',
    accessor: 'percent_diff',
    Cell: ({ value }) => (value * 100).toFixed(2) + ' %',
  },
];

export default function AvgUnitCostPerYear() {
  const componentRef = useRef(null);

  const [commission, setCommission] = useState(0.05);
  const [miscellaneous, setMiscellaneous] = useState(0.03);
  const [exchangePadding, setExchangePadding] = useState(0.03);
  const [development, setDevelopment] = useState(2.25);

  const [resourceData, resourceColumns, loading] = useFetchTableData(
    `/api/reports/yearly-avg-summary?commission=${commission}&miscellaneous=${miscellaneous}&exchangePadding=${exchangePadding}&development=${development}`,
    columns
  );

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={11}>
          <Typography variant='h4'>Average Unit Cost Per Year</Typography>
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
              grouping={false}
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
