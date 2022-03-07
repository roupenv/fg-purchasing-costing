import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

export default function Unknown404() {
  return (
    <Box sx={{ height: '100vh' }}>
      <Stack direction='row' justifyContent='center' alignItems='center' spacing={2} sx={{ height: 1 }}>
        <Alert
          variant='filled'
          severity='warning'
          sx={{ p: '100px' }}
          icon={<WarningAmberIcon sx={{ fontSize: 50 }} />}
        >
          <AlertTitle sx={{ typography: 'h3' }}>404</AlertTitle>
          <Typography variant='h6'> Unknown</Typography>
        </Alert>
      </Stack>
    </Box>
  );
}
