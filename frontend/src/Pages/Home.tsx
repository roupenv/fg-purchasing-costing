import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { endOfYear, format, isAfter, isBefore, startOfYear, subDays } from 'date-fns';
import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import DashboardCard from '../Components/DashboardComponents/DashboardCard';
import DashboardSummaryBar from '../Components/DashboardComponents/DashboardSummaryBar/DashboardSummaryBar';
import useFetchApi from '../Hooks/useFetchApi';
import { euroFormatter, usFormatter } from '../util/currencyFormatter';

const totalCostMetrics = [
  {
    name: 'Units',
    accessor: 'total_units',
    formatter: (value: any) => value,
    checked: true,
    stroke: '#023047',
    yAxisId: 'right',
  },
  {
    name: 'Purchases (Euro)',
    accessor: 'total_unit_cost',
    formatter: (value: any) => euroFormatter.format(value),
    checked: true,
    stroke: '#FB8500',
    yAxisId: 'left',
  },
  {
    name: 'Shipping',
    accessor: 'total_shipping_costs',
    formatter: (value: any) => usFormatter.format(value),
    checked: true,
    stroke: '#219EBC',
    yAxisId: 'left',
  },
  {
    name: 'Duty',
    accessor: 'total_duty_costs',
    formatter: (value: any) => usFormatter.format(value),
    checked: true,
    stroke: '#FFB703',
    yAxisId: 'left',
  },
];

export default function Home() {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xs'));

  const dateToday = endOfYear(new Date());
  const dateLastYear = startOfYear(subDays(new Date(), 365));

  const [startDate, setStartDate] = useState(dateLastYear);
  const [endDate, setEndDate] = useState(dateToday);

  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');


  const { data: exchangeRateOverTime, loading: exchangeRateOverTimeLoading } = useFetchApi<any[]>(
    `/api/dashboard/exchange-rate-over-time?start=${formattedStartDate}&end=${formattedEndDate}`,
    true
  );

  const { data: transitTime, loading: transitTimeLoading } = useFetchApi<any[]>(
    `/api/dashboard/transit-time?start=${formattedStartDate}&end=${formattedEndDate}`,
    true
  );

  const { data: totalCosts, loading: totalCostsLoading } = useFetchApi<any[]>(
    `/api/dashboard/total-costs?start=${formattedStartDate}&end=${formattedEndDate}`,
    true
  );

  const { data: shippingCostVsUnitsShipped, loading: shippingCostVsUnitsShippedLoading } = useFetchApi<any[]>(
    `/api/dashboard/shipping-cost-vs-units-shipped?start=${formattedStartDate}&end=${formattedEndDate}`,
    true
  );

  const { data: exchangeRateToday } = useFetchApi<number>(`/api/dashboard/exchange-rate-today`, true);

  const { data: metricsSummary, loading: metricsSummaryLoading } = useFetchApi<any[]>(
    `/api/dashboard/metrics-summary`,
    true,
    undefined,
    [
      {
        year: 2021,
        total_purchases: 0,
        total_units: 0,
      },
      {
        year: 2021,
        total_purchases: 0,
        total_units: 0,
      },
    ]
  );

  const summaryCards = [
    {
      cardTitle: 'Total Purchases (YTD)',
      currentMetric: metricsSummary![0]['total_purchases'],
      previousMetric: metricsSummary![1]['total_purchases'],
      type: 'currency',
    },
    {
      cardTitle: 'Total Units (YTD)',
      currentMetric: metricsSummary![0]['total_units'],
      previousMetric: metricsSummary![1]['total_units'],
      type: 'number',
    },
    {
      cardTitle: "Today's Pub. Exchange Rate",
      metric: exchangeRateToday!,
      subtitle: 'EUR/USD',
    },
  ];

  const [checkboxList, setCheckBoxList] = useState([...totalCostMetrics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const indexToChange = checkboxList.findIndex((item) => item.accessor === e.target.name);
    checkboxList[indexToChange].checked = e.target.checked;
    setCheckBoxList([...checkboxList]);
  };

  return (
    <Box id='dashboard-container' sx={{ fontSize: { xs: '.8rem', sm: '1rem' } }}>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <Typography variant='h4'>Dashboard</Typography>
        </Grid>
        <Grid item container spacing={4} xs={9} justifyContent='flex-end'>
          <Grid item xs={5} sm={4} md={3} lg={2}>
            <DatePicker
              views={['year']}
              label='Start Year'
              value={startDate}
              onChange={(newValue) => {
                const newStartDate = startOfYear(newValue as Date);
                if (isBefore(newStartDate, endDate as Date)) {
                  setStartDate(newStartDate);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item xs={5} sm={4} md={3} lg={2}>
            <DatePicker
              views={['year']}
              label='End Year'
              value={endDate}
              onChange={(newValue) => {
                const newEndDate = endOfYear(newValue as Date);
                if (isAfter(newEndDate, startDate as Date)) {
                  setEndDate(newEndDate);
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {!metricsSummaryLoading && <DashboardSummaryBar cards={summaryCards} />}
        </Grid>

        <Grid item xs={12}>
          <Masonry columns={{ xs: 1, lg: 2 }} spacing={6} sx={{ width: 'auto' }}>
            <Paper sx={{ p: '16px', pb: '40px' }} elevation={6}>
              <Box>
                <Typography variant='h6'>Total Costs Year Over Year</Typography>
                <Divider />
                <FormControl sx={{ my: 2 }} component='fieldset' variant='standard'>
                  <FormLabel component='legend'>Select Total Costs</FormLabel>
                  <FormGroup row>
                    {checkboxList.map((item) => (
                      <FormControlLabel
                        key={item.accessor}
                        control={
                          <Checkbox size='small' checked={item.checked} onChange={handleChange} name={item.accessor} />
                        }
                        label={item.name}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Box>

              <Stack
                direction='column'
                spacing={4}
                alignItems='center'
                justifyContent='space-around'
                divider={<Divider orientation='horizontal' flexItem />}
              >
                {!totalCostsLoading &&
                  totalCosts!.map((yearOfData: any) => (
                    <Box key={String(yearOfData[0].year)} sx={{  width: 1, height: { xs: '200px', md: '300px' } }}>
                      <Typography variant='h6'>{yearOfData[0].year}</Typography>
                      <ResponsiveContainer height='100%' width='100%' minWidth={380}>
                        <LineChart
                          syncId='total-costs'
                          data={yearOfData}
                          margin={{ top: 5, right: 0, left: isMobile ? 20: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray='3 3' />
                          <XAxis dataKey='month' />
                          <YAxis yAxisId='left' tickFormatter={(value: any) => usFormatter.format(value)} />
                          <YAxis yAxisId='right' orientation='right' />
                          <Tooltip
                            formatter={(value: any, name: any, props: any) => {
                              const metricMeta = totalCostMetrics.filter((metric) => metric.accessor === name)[0];
                              return [metricMeta.formatter(value), metricMeta.name];
                            }}
                          />
                          <Legend
                            formatter={(value, entry, index) =>
                              totalCostMetrics.filter((metric) => metric.accessor === value)[0].name
                            }
                          />
                          {checkboxList
                            .filter((item) => item.checked === true)
                            .map((line) => (
                              <Line
                                key={line.accessor}
                                yAxisId={line.yAxisId}
                                type='monotone'
                                dataKey={line.accessor}
                                stroke={line.stroke}
                              />
                            ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  ))}
              </Stack>
            </Paper>

            <DashboardCard cardTitle='Transit Time' loading={transitTimeLoading}>
              <BarChart data={transitTime} margin={{ top: 5, right: 30, left: -30, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='delivery_days'
                  type='number'
                  padding={{ left: 25, right: 25 }}
                  domain={['dataMin', 'dataMax']}
                  ticks={transitTime ? (transitTime.map((item: any) => item.delivery_days) as number[]) : undefined}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='number_instances' fill='#8884d8' name='# of Shipments' />
                <ReferenceLine
                  x={transitTime ? transitTime[0].avg_delivery_days : null}
                  label='Avg.'
                  stroke='green'
                  strokeWidth={2}
                />
                <ReferenceLine
                  x={transitTime ? transitTime[0].median_delivery_days : null}
                  stroke='blue'
                  strokeWidth={2}
                >
                  <Label value='Median' position={'insideTop'} />
                </ReferenceLine>
              </BarChart>
            </DashboardCard>

            <DashboardCard cardTitle='Exchange Rate Over Time' loading={exchangeRateOverTimeLoading}>
              <LineChart data={exchangeRateOverTime} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='year_month' />
                <YAxis type='number' domain={['auto', 'auto']} />
                <Tooltip formatter={(value: number) => value.toFixed(3)} />
                <Line type='basis' dataKey='exchange_rate' stroke='#FB8500' connectNulls />
              </LineChart>
            </DashboardCard>

            <DashboardCard cardTitle='Shipping Cost Per Unit Over Time' loading={shippingCostVsUnitsShippedLoading}>
              <LineChart data={shippingCostVsUnitsShipped} margin={{ top: 5, right: 30, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='arrival_date' />
                <YAxis type='number' domain={['auto', 'auto']} />
                <Tooltip formatter={(value: number) => usFormatter.format(value)} />
                <Line type='basis' dataKey='shipping_cost_per_unit' stroke='#023047' connectNulls />
              </LineChart>
            </DashboardCard>
          </Masonry>
        </Grid>
      </Grid>
    </Box>
  );
}
