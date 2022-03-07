import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';
import NumberFormat from 'react-number-format';

export interface IDashboardSummaryComparisonCard {
  cardTitle: string;
  currentMetric: number;
  previousMetric: number;
  type: string;
}

export default function DashboardSummaryComparisonCard({
  cardTitle,
  currentMetric,
  previousMetric,
  type,
}: IDashboardSummaryComparisonCard) {
  return (
    <Stack direction='column'>
      <Typography variant='subtitle1'>{cardTitle}</Typography>
      <Typography variant='h6'>
        <NumberFormat
          displayType='text'
          prefix={type === 'currency' ? '€' : undefined}
          thousandSeparator
          value={currentMetric}
        />
      </Typography>
      <Stack direction='row' spacing={1} justifyContent='flex-start'>
        <Typography variant='body2'>
          <NumberFormat
            displayType='text'
            prefix={type === 'currency' ? 'vs. €' : undefined}
            suffix=' Last Year'
            thousandSeparator
            value={previousMetric}
          />
          {' | '}
          <NumberFormat
            displayType='text'
            prefix={currentMetric >= previousMetric ? '+' : undefined}
            suffix='%'
            thousandSeparator
            value={(((currentMetric - previousMetric) / previousMetric) * 100).toFixed(2)}
          />
        </Typography>
        {currentMetric >= previousMetric ? (
          <Avatar sx={{ bgcolor: 'success.light', width: 20, height: 20 }}>
            <KeyboardArrowUpIcon />
          </Avatar>
        ) : (
          <Avatar sx={{ bgcolor: 'error.light', width: 20, height: 20 }}>
            <KeyboardArrowDownIcon />
          </Avatar>
        )}
      </Stack>
    </Stack>
  );
}
