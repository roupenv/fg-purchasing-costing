import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface IDashboardSummaryStandardCard {
  cardTitle: string;
  metric: number;
  subtitle: string;
}

export default function DashboardSummaryStandardCard({ cardTitle, metric, subtitle }: IDashboardSummaryStandardCard) {
  return (
      <Stack direction='column' alignItems='flex-start'>
        <Typography variant='subtitle1'>{cardTitle}</Typography>
        <Stack direction='row' alignItems='baseline' spacing={1}>
          <Typography variant='h6'>{metric}</Typography>
          <Typography variant='subtitle2'>{subtitle}</Typography>
        </Stack>
      </Stack>
  );
}
